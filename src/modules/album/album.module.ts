import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  imports: [],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [],
})
export class AlbumModule {}
