import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs';
import { PayLinkDto } from './dto/paylink.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(@Body() body: any) {
    console.log(body);
    return HttpStatus.OK;
  }

  @Get('generate-pay-link')
  generatePayLink() {
    return this.paymentService
      .generatePayLink({
        product_id: '48829',
        passthrough: 'sraka@gmail.com',
        customer_email: 'sraka@gmail.com',
        title: 'sraka@gmail.com',
        custom_message: 'sraka@gmail.com',
      })
      .pipe(map((r) => plainToInstance(PayLinkDto, r)));
  }
}
