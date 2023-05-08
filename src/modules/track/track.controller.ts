import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { Repositories } from '../../models/db.repositories';
import { CreateTrackBodyDto } from './dto/track.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { JwtAuthGuard } from '../../common/guards/JwtAuthGuard';
import { CurrentUser } from '../../common/decorators/auth/current-user';
import { User } from '../../models/user/user.schema';

@Controller('tracks')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    private readonly repositories: Repositories,
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  getAllTracks(@CurrentUser() user: User) {
    return this.repositories.track.findMany();
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
  async createTrack(@Body() body: CreateTrackBodyDto) {
    return await this.repositories.track.create(body);
  }

  @Post('upload-cover/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.trackService.saveTrackCover(id, file.buffer, file.originalname);
  }

  @Post('upload-audio/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.trackService.saveTrackAudio(id, file.buffer, file.originalname);
  }
}
