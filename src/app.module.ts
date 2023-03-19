import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EndpointsModule } from './modules/endpoints.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    EndpointsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
