import { Global, Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AWS_S3_PROVIDER } from './file-storage.constants';
import { ConfigService } from '@nestjs/config';
import { FilesService } from './file-storage.service';

@Global()
@Module({
  imports: [],
  exports: [AWS_S3_PROVIDER, FilesService],
  providers: [
    {
      provide: AWS_S3_PROVIDER,
      useFactory: (configService: ConfigService): S3 =>
        new S3({
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY'),
            secretAccessKey: configService.get<string>('AWS_SECRET_KEY'),
          },
          region: configService.get<string>('AWS_REGION'),
        }),
      inject: [ConfigService],
    },
    FilesService,
  ],
})
export class FileStorageModule {}
