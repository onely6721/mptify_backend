import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { plainToInstance } from 'class-transformer';
import { firstValueFrom, map, Observable } from 'rxjs';
import { PayLinkDto } from './dto/paylink.dto';
import { UpdateQuery } from 'mongoose';
import { PaddleService } from '../../shared/paddle/paddle.service';
import { Repositories } from '../../models/db.repositories';
import { T_UserDocument, User } from '../../models/user/user.schema';
import { T_WebhookBody } from './dto/webhook';
import { CurrentUser } from '../../common/decorators/auth/current-user';
import { JwtAuthGuard } from '../../common/guards/JwtAuthGuard';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paddleService: PaddleService,
    private readonly repositories: Repositories,
  ) {}

  @Get('packages')
  async getPackageList() {
    return this.repositories.packages.findMany();
  }

  @UseGuards(JwtAuthGuard)
  @Get('packages/:id/pay-link')
  async getPayLink(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<Observable<PayLinkDto>> {
    const entity = await this.repositories.packages.findById(id);

    if (!entity) {
      throw new NotFoundException(`There is no package with id ${id}`);
    }

    if (user.isSubscribed) {
      throw new ConflictException('The user has already subscribed');
    }

    return this.paddleService
      .generatePayLink({
        product_id: entity.planId,
        passthrough: user.id,
        customer_email: user.email,
        title: entity.displayName,
        custom_message: entity.description,
      })
      .pipe(map((r) => plainToInstance(PayLinkDto, r)));
  }

  @Post('webhook')
  async webhook(@Body() body: T_WebhookBody) {
    const user = await this.repositories.user.findById(body.passthrough);
    const [subscription] = await firstValueFrom(
      this.paddleService.listSubscribers({
        subscription_id: body.subscription_id,
      }),
    );

    const plan = await this.repositories.packages.findOne({
      planId: body.subscription_plan_id,
    });

    if (plan && user && subscription) {
      const canProcess =
        !user.isSubscribed ||
        (user.subscription &&
          user.subscription.subscriptionId === body.subscription_id);

      if (canProcess) {
        let updateQuery: UpdateQuery<T_UserDocument> = {
          'subscription.packageId': plan.id,
          'subscription.subscriptionStatus': subscription.state,
          'subscription.subscriptionPlanId': subscription.plan_id,
          'subscription.subscriptionEmail': subscription.user_email,
          'subscription.subscriptionId': subscription.subscription_id,
          'subscription.updateUrl': subscription.update_url,
          'subscription.cancelUrl': subscription.cancel_url,
        };

        if (
          subscription.state === 'deleted' ||
          body.alert_name === 'subscription_cancelled'
        ) {
          updateQuery = {
            'subscription.packageId': plan.id,
            'subscription.subscriptionStatus': subscription.state,
            'subscription.subscriptionPlanId': subscription.plan_id,
            'subscription.subscriptionEmail': subscription.user_email,
            'subscription.subscriptionId': subscription.subscription_id,
            $unset: {
              'subscription.pausedFrom': 1,
              'subscription.updateUrl': 1,
              'subscription.cancelUrl': 1,
              'subscription.nextBillAt': 1,
              'subscription.maxRank': 1,
            },
          };

          if (body.alert_name === 'subscription_cancelled') {
            const nextBill =
              subscription.next_payment?.date ||
              body.cancellation_effective_date;
            const subDates = PaymentService.calcSubscriptionDates(nextBill);
            updateQuery = {
              ...updateQuery,
              'subscription.availableTo': subDates.availableTo,
            };
          }
        } else {
          if (body.alert_name === 'subscription_created') {
            const nextBill =
              subscription.next_payment?.date || body.next_bill_date;
            const subDates = PaymentService.calcSubscriptionDates(nextBill);
            updateQuery = {
              ...updateQuery,
              'subscription.availableTo': subDates.availableTo,
              'subscription.nextBillAt': subDates.nextBill,
            };
          }

          if (body.alert_name === 'subscription_payment_failed') {
            updateQuery = {
              'subscription.subscriptionStatus': body.status,
            };
          }

          if (body.alert_name === 'subscription_payment_succeeded') {
            const nextBill =
              subscription.next_payment?.date || body.next_bill_date;
            const subDates = PaymentService.calcSubscriptionDates(nextBill);
            updateQuery = {
              ...updateQuery,
              'subscription.availableTo': subDates.availableTo,
              'subscription.nextBillAt': subDates.nextBill,
            };
          }

          if (body.alert_name === 'subscription_updated') {
            const subDates = PaymentService.calcSubscriptionDates(
              body.next_bill_date,
            );
            updateQuery = {
              ...updateQuery,
              'subscription.availableTo': subDates.availableTo,
              'subscription.nextBillAt': subDates.nextBill,
            };

            if (subscription.paused_from) {
              updateQuery = {
                ...updateQuery,
                'subscription.pausedFrom': subscription.paused_from,
              };
            } else {
              updateQuery = {
                ...updateQuery,
                $unset: { 'subscription.pausedFrom': 1 },
              };
            }

            if (
              String(subscription.plan_id) === body.subscription_plan_id &&
              body.old_subscription_plan_id !== body.subscription_plan_id
            ) {
              updateQuery = {
                ...updateQuery,
                $unset: {
                  ...updateQuery.$unset,
                  'subscription.limitsRewrite': 1,
                },
              };
            }
          }
        }

        await this.repositories.user.updateById(user.id, updateQuery);
      }
    }

    return { status: 'ok' };
  }
}
