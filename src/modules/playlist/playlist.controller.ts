import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { FilesService } from '../../providers/file-storage/file-storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Repositories } from '../../models/db.repositories';
import { CurrentUser } from '../../common/decorators/auth/current-user';
import { CreatePlaylistDto, UpdatePlaylistDto } from './dto/playlist.dto';
import { User } from '../../models/user/user.schema';
import { JwtAuthGuard } from '../../common/guards/JwtAuthGuard';
import { Types } from 'mongoose';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly repositories: Repositories,
  ) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyPlaylist(@CurrentUser() user) {
    return this.repositories.playlist.findMany({
      userId: user.id,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPlaylist(@CurrentUser() user, @Param('id') id: string) {
    const playlist = await this.repositories.playlist.findById(id);
    if (!playlist) {
      throw new NotFoundException('Album not found');
    }

    return playlist;
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createPlaylist(@CurrentUser() user, @Body() body: CreatePlaylistDto) {
    let title = body.title;
    if (!title) {
      const playlists = await this.repositories.playlist.findMany({
        userId: user.id,
      });
      title = `My Playlist #${playlists.length + 1}`;
    }
    return this.repositories.playlist.create({ title, userId: user.id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePlaylist(
    @CurrentUser() user,
    @Body() body: UpdatePlaylistDto,
    @Param('id') id: string,
  ) {
    const playlist = await this.repositories.playlist.findById(id);

    if (!playlist || playlist.userId.toString() !== user.id) {
      throw new NotFoundException('Album does not exists');
    }

    return this.repositories.playlist.updateById(id, {
      ...body,
      userId: user.id,
    });
  }

  @Post('upload-cover/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const playlist = await this.repositories.playlist.findById(id);

    if (!playlist || playlist.userId.toString() !== user.id) {
      throw new NotFoundException('Album does not exists');
    }

    return this.playlistService.savePlaylistCover(
      id,
      file.buffer,
      file.originalname,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePlaylist(@Param('id') id: string, @CurrentUser() user: User) {
    const playlist = await this.repositories.playlist.findById(id);
    if (!playlist || playlist.userId.toString() !== user.id) {
      throw new NotFoundException('Album with this id not found');
    }

    return this.repositories.playlist.deleteById(id);
  }

  @Post(':id/add-track/:trackId')
  @UseGuards(JwtAuthGuard)
  async addTrack(
    @CurrentUser() user,
    @Param('id') id: string,
    @Param('trackId') trackId: string,
  ) {
    const playlist = await this.repositories.playlist.findById(id);

    if (!playlist || playlist.userId.toString() !== user.id) {
      throw new NotFoundException('Album does not exists');
    }

    const track = await this.repositories.track.findById(trackId);
    if (!track) {
      throw new NotFoundException('Track does not exists');
    }

    return await this.repositories.playlist.updateById(id, {
      $push: { tracksIds: new Types.ObjectId(trackId) },
    });
  }

  @Post(':id/delete-playlist/:trackId')
  @UseGuards(JwtAuthGuard)
  async deleteTrackFromPlaylist(
    @CurrentUser() user,
    @Param('id') id: string,
    @Param('trackId') trackId: string,
  ) {
    const playlist = await this.repositories.playlist.findById(id);

    if (!playlist || playlist.userId.toString() !== user.id) {
      throw new NotFoundException('Album does not exists');
    }

    const track = await this.repositories.track.findById(trackId);
    if (!track || track.userId.toString() !== user.id) {
      throw new NotFoundException('Track does not exists');
    }

    return this.repositories.album.updateById(id, {
      $pull: { tracksIds: trackId },
    });
  }
}
