import { Module } from '@nestjs/common';
import { EndpointsModule } from './modules/endpoints.module';
import { DbModule } from './models/db.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, DbModule, EndpointsModule],
  controllers: [],
  exports: [],
})
export class AppModule {}
