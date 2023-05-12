import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaddleService } from '../../shared/paddle/paddle.service';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService, PaddleService],
  exports: [],
})
export class PaymentModule {}
