import {
  Body,
  Controller,
  Delete,
  Get,
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
import { User } from '../../models/user/user.schema';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly repositories: Repositories,
    private readonly filesService: FilesService,
  ) {}

  @Get('my')
  async getMyPlaylist(@CurrentUser() user) {
    return this.repositories.playlist.findMany({
      userId: user.id,
    });
  }

  @Post('')
  async createPlaylist(@CurrentUser() user, @Body() body: CreatePlaylistDto) {
    return this.repositories.playlist.create({ ...body, userId: user.id });
  }

  @Post('cover')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadPublicFile(file.buffer, file.originalname);
  }

  @Delete(':id')
  async deletePlaylist(@Param('id') id: string, @CurrentUser() user: User) {
    const playlist = await this.repositories.playlist.findById(id);
    if (!playlist || playlist.userId.toString() !== user.id) {
      throw new NotFoundException('Playlist with this id not found');
    }

    return this.repositories.playlist.deleteById(id);
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

    const track = await this.repositories.track.findById(trackId);
    if (!track) {
      throw new NotFoundException('Track does not exists');
    }

    return this.repositories.playlist.updateById(id, {
      $push: { tracksIds: trackId },
    });
  }
}
