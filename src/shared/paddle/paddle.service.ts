import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repositories } from '../../models/db.repositories';
import {
  T_ListSubscribersParams,
  T_ListSubscribersResponse,
  T_PaddleResponse,
  T_PayLink,
  T_PayLinkParams,
} from './paddle.types';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable()
export class PaddleService {
  constructor(
    private readonly repositories: Repositories,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly vendorUrl: string = 'https://sandbox-vendors.paddle.com';

  private readonly checkoutUrl: string = 'https://sandbox-checkout.paddle.com';

  private request<P, T>(path: string, params?: P): Observable<T> {
    console.log(this.configService.get<string>('PADDLE_VENDOR_ID'));
    console.log(this.configService.get<string>('PADDLE_VENDOR_AUTH_CODE'));
    const body = new URLSearchParams({
      vendor_id: this.configService.get<string>('PADDLE_VENDOR_ID'),
      vendor_auth_code: this.configService.get<string>(
        'PADDLE_VENDOR_AUTH_CODE',
      ),
    });

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) {
          body.set(k, v);
        }
      });
    }

    return this.httpService
      .post<T_PaddleResponse<T>>(`${this.vendorUrl}/api/2.0${path}`, body)
      .pipe(
        switchMap((res) => {
          if (!res.data.success) {
            const err$ = of<string | null>(null);
            console.log(res.data);
            return err$.pipe(
              catchError(() =>
                throwError(
                  () =>
                    new InternalServerErrorException(
                      'Problem with payments. Please try again later',
                    ),
                ),
              ),
              switchMap((err) =>
                throwError(
                  () =>
                    new InternalServerErrorException(
                      err || 'Problem with payments. Please try again later',
                    ),
                ),
              ),
            );
          }

          return of(res.data.response);
        }),
      );
  }

  generatePayLink(params: T_PayLinkParams): Observable<T_PayLink> {
    return this.request('/product/generate_pay_link', params);
  }

  listSubscribers(
    params: T_ListSubscribersParams,
  ): Observable<T_ListSubscribersResponse[]> {
    return this.request(`/subscription/users`, params);
  }

  cancelSubscription(id: string): Observable<any> {
    return this.request('/subscription/users_cancel', { subscription_id: id });
  }
}
