import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaddleService } from './paddle/paddle.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [PaddleService],
  exports: [PaddleService, HttpModule],
  controllers: [],
})
export class SharedModule {}
