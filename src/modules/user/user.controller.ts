import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/auth/current-user';
import { JwtAuthGuard } from '../../common/guards/JwtAuthGuard';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../models/user/user.schema';
import { Express } from 'express';
import { Repositories } from '../../models/db.repositories';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly repositories: Repositories,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user) {
    return user;
  }

  @Get('my-tracks')
  @UseGuards(JwtAuthGuard)
  async myTracks(@CurrentUser() user) {
    return this.repositories.track.findMany({
      userId: user.id,
    });
  }

  @Post('upload-avatar/me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.saveAvatar(user.id, file.buffer, file.originalname);
  }
}
