import {
  BadRequestException,
  Body,
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
import { TrackService } from './track.service';
import { Repositories } from '../../models/db.repositories';
import { CreateTrackBodyDto, TracksSearchQueryDto } from './dto/track.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { JwtAuthGuard } from '../../common/guards/JwtAuthGuard';
import { CurrentUser } from '../../common/decorators/auth/current-user';
import { User } from '../../models/user/user.schema';

import { isAfter, addMinutes } from 'date-fns';

@Controller('tracks')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    private readonly repositories: Repositories,
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getTracks(
    @CurrentUser() user: User,
    @Query() searchQuery: TracksSearchQueryDto,
  ) {
    const { limit, page, title } = searchQuery;

    const filter = {};

    if (title) {
      filter['title'] = { $regex: new RegExp(title, 'i') };
    } else {
      return [];
    }

    return this.repositories.track.findMany(filter, { page, limit });
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  getMyTracks(@CurrentUser() user: User) {
    return this.repositories.track.findMany({ userId: user.id });
  }

  @Get(':id')
  getTrackById(@Param('id') id: string) {
    return this.repositories.track.findById(id);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createTrack(@CurrentUser() user, @Body() body: CreateTrackBodyDto) {
    // if (!user.isVerifiedArtist) {
    //   throw new UnauthorizedException(
    //     'You do not have permission to perform this action.',
    //   );
    // }
    return await this.repositories.track.create({ ...body });
  }

  @Post('upload-cover/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const track = await this.repositories.track.findById(id);

    // if (!track || track.userId.toString() !== user.id) {
    //   throw new NotFoundException('Track does not exists');
    // }

    return this.trackService.saveTrackCover(id, file.buffer, file.originalname);
  }

  @Post('upload-audio/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const track = await this.repositories.track.findById(id);

    // if (!track || track.userId.toString() !== user.id) {
    //   throw new NotFoundException('Track does not exists');
    // }
    return this.trackService.saveTrackAudio(id, file.buffer, file.originalname);
  }

  @Post('add-listen/:id')
  @UseGuards(JwtAuthGuard)
  async addListen(@CurrentUser() user: User, @Param('id') id: string) {
    if (
      user?.lastListenedSongDate &&
      isAfter(addMinutes(user?.lastListenedSongDate, 1), new Date())
    ) {
      throw new BadRequestException('Bad query');
    }

    const track = await this.repositories.track.findById(id);

    if (!track) {
      throw new NotFoundException('Track does not exists');
    }

    await this.repositories.user.updateById(user.id, {
      lastListenedSongDate: new Date(),
    });

    await this.repositories.user.updateById(track.userId, {
      $inc: { listens: 1 },
    });

    await this.repositories.listen.create({
      userId: user.id,
      trackId: track.id,
    });

    return this.repositories.track.updateById(id, { $inc: { listens: 1 } });
  }
}
