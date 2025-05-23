import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { FilesService } from '../../providers/file-storage/file-storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Repositories } from '../../models/db.repositories';
import { CurrentUser } from '../../common/decorators/auth/current-user';
import { CreateAlbumDto } from './dto/album.dto';
import { User } from '../../models/user/user.schema';
import { JwtAuthGuard } from '../../common/guards/JwtAuthGuard';
import { Types } from 'mongoose';
import { AlbumsSearchQueryDto } from './dto/albums.search.dto';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly repositories: Repositories,
    private readonly filesService: FilesService,
  ) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchAlbums(
    @CurrentUser() user,
    @Query() searchQuery: AlbumsSearchQueryDto,
  ) {
    const { limit, page, keyword } = searchQuery;

    const filter = {};

    if (keyword) {
      filter['title'] = { $regex: new RegExp(keyword, 'i') };
    } else {
      return [];
    }

    return this.repositories.album.findMany({ ...filter }, { page, limit });
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyAlbums(@CurrentUser() user) {
    return this.repositories.album.findMany({
      userId: user.id,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAlbum(@CurrentUser() user, @Param('id') id: string) {
    const album = await this.repositories.album.findById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    await album.populate('tracks');
    return album;
  }

  @Post('create-album')
  @UseGuards(JwtAuthGuard)
  async createAlbum(@CurrentUser() user, @Body() body: CreateAlbumDto) {
    if (!user.isVerifiedArtist) {
      throw new UnauthorizedException(
        'You do not have permission to perform this action.',
      );
    }
    return this.repositories.album.create({ ...body, userId: user.id });
  }
  @Post('upload-cover/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const album = await this.repositories.album.findById(id);

    if (!album || album.userId.toString() !== user.id) {
      throw new NotFoundException('Album does not exists');
    }

    return this.albumService.saveAlbumCover(id, file.buffer, file.originalname);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePlaylist(@Param('id') id: string, @CurrentUser() user: User) {
    const album = await this.repositories.album.findById(id);
    if (!album || album.userId.toString() !== user.id) {
      throw new NotFoundException('Album with this id not found');
    }

    return this.repositories.album.deleteById(id);
  }

  @Post(':id/add-track/:trackId')
  @UseGuards(JwtAuthGuard)
  async addTrack(
    @CurrentUser() user,
    @Param('id') id: string,
    @Param('trackId') trackId: string,
  ) {
    const album = await this.repositories.playlist.findById(id);

    if (!album || album.userId !== user.id) {
      throw new NotFoundException('Album does not exists');
    }

    const track = await this.repositories.track.findById(trackId);
    if (!track || track.userId !== user.id) {
      throw new NotFoundException('Track does not exists');
    }

    return this.repositories.album.updateById(id, {
      $push: { tracksIds: new Types.ObjectId(trackId) },
    });
  }

  @Post(':id/delete-track/:trackId')
  @UseGuards(JwtAuthGuard)
  async deleteTrackFromAlbum(
    @CurrentUser() user,
    @Param('id') id: string,
    @Param('trackId') trackId: string,
  ) {
    const album = await this.repositories.album.findById(id);

    if (!album || album.userId !== user.id) {
      throw new NotFoundException('Album does not exists');
    }

    const track = await this.repositories.track.findById(trackId);
    if (!track || track.userId !== user.id) {
      throw new NotFoundException('Track does not exists');
    }

    return this.repositories.album.updateById(id, {
      $pull: { tracksIds: trackId },
    });
  }
}
