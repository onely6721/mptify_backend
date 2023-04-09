import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AWS_S3_PROVIDER } from './file-storage.constants';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AWS_S3_PROVIDER) private readonly s3: S3,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
        ACL: 'public-read',
      })
      .promise();

    const newFile = {
      key: uploadResult.Key,
      url: uploadResult.Location,
    };
    return newFile;
  }

  //   async deletePublicFile(fileKey: number) {
  //     await this.s3
  //       .deleteObject({
  //         Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
  //         Key: fileKey,
  //       })
  //       .promise();
  //   }
}
