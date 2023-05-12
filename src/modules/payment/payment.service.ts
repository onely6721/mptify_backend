import { Injectable } from '@nestjs/common';
import { Repositories } from '../../models/db.repositories';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { addDays, startOfDay } from 'date-fns';
import { T_SubscriptionDates } from './payment.types';

@Injectable()
export class PaymentService {
  constructor(
    private readonly repositories: Repositories,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  static calcSubscriptionDates(nextBillStr: string): T_SubscriptionDates {
    const nextBill = startOfDay(new Date(nextBillStr));
    const availableTo = addDays(nextBill, 1);
    return {
      nextBill,
      availableTo,
    };
  }
}
