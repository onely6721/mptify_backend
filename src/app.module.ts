import { Module } from '@nestjs/common';
import { EndpointsModule } from './modules/endpoints.module';
import { DbModule } from './models/db.module';
import { CoreModule } from './core/core.module';
import { FileStorageModule } from './providers/file-storage/file-storage.module';

@Module({
  imports: [CoreModule, DbModule, EndpointsModule, FileStorageModule],
  controllers: [],
  exports: [],
})
export class AppModule {}
