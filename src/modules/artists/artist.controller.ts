import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ArtistService } from './artist.service';
import { Repositories } from '../../models/db.repositories';
import { JwtAuthGuard } from '../../common/guards/JwtAuthGuard';
import { CurrentUser } from '../../common/decorators/auth/current-user';
import { User } from '../../models/user/user.schema';
import { ArtistsSearchQueryDto } from './dto/artists.search.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('artists')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly repositories: Repositories,
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getArtists(
    @CurrentUser() user: User,
    @Query() searchQuery: ArtistsSearchQueryDto,
  ) {
    const { limit, page, keyword } = searchQuery;

    const filter = {};

    if (keyword) {
      filter['firstName'] = { $regex: new RegExp(keyword, 'i') };
    } else {
      return [];
    }

    return this.repositories.user.findMany(
      { ...filter, isVerifiedArtist: true },
      { page, limit },
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getArtistById(@CurrentUser() user: User, @Param('id') id: string) {
    const matchedUser = await this.repositories.user.findById(id);

    if (!matchedUser || !matchedUser?.isVerifiedArtist) {
      throw new NotFoundException('Not found artist');
    }

    return {
      id: matchedUser.id,
      artistName: matchedUser?.artistName || matchedUser.firstName,
      listens: matchedUser.listens,
      avatar: matchedUser?.avatar,
    };
  }

  @Get('media/:id')
  @UseGuards(JwtAuthGuard)
  async getMediaArtistById(@CurrentUser() user: User, @Param('id') id: string) {
    const matchedAlbums = await this.repositories.album.findMany({
      userId: id,
    });

    const matchedTracks = await this.repositories.track.findMany(
      {
        userId: id,
      },
      { sort: { listens: -1 } },
    );

    return { albums: matchedAlbums, tracks: matchedTracks };
  }

  @Post('upload-cover/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.artistService.saveArtistCover(
      id,
      file.buffer,
      file.originalname,
    );
  }
}
