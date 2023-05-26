import {
  Controller,
  Get,
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
