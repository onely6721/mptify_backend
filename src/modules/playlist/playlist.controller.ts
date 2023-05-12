import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { FilesService } from '../../providers/file-storage/file-storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Repositories } from '../../models/db.repositories';
import { CurrentUser } from '../../common/decorators/auth/current-user';
import { CreatePlaylistDto } from './dto/playlist.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly repositories: Repositories,
    private readonly filesService: FilesService,
  ) {}

  @Post('')
  async createPlaylist(@CurrentUser() user, @Body() body: CreatePlaylistDto) {
    return this.repositories.playlist.create({ ...body, userId: user.id });
  }

  @Post(':id/add-track/:trackId')
  async addTrack(
    @CurrentUser() user,
    @Param('id') id: string,
    @Param('trackId') trackId: string,
  ) {
    const playlist = await this.repositories.playlist.findById(id);

    if (!playlist || playlist.userId !== user.id) {
      throw new NotFoundException('Playlist does not exists');
    }
  }

  @Post('cover')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadPublicFile(file.buffer, file.originalname);
  }
}
