import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { FilesService } from '../../providers/file-storage/file-storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly filesService: FilesService,
  ) {}

  @Post('cover')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadPublicFile(file.buffer, file.originalname);
  }
}
