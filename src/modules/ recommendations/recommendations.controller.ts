import { Controller, Get, UseGuards } from '@nestjs/common';
import { FilesService } from '../../providers/file-storage/file-storage.service';
import { Repositories } from '../../models/db.repositories';
import { RecommendationsService } from './recommendations.service';
import { CurrentUser } from '../../common/decorators/auth/current-user';
import { User } from '../../models/user/user.schema';
import { JwtAuthGuard } from '../../common/guards/JwtAuthGuard';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
    private readonly repositories: Repositories,
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getRecommendations(@CurrentUser() user: User) {
    return this.recommendationsService.getRecommendations(user);
  }

  @Get('popular-artists')
  @UseGuards(JwtAuthGuard)
  async getPopularArtists(@CurrentUser() user: User) {
    return this.repositories.user.findMany(
      { isVerifiedArtist: true },
      { sort: { listens: -1 }, limit: 7 },
    );
  }

  @Get('popular-tracks')
  @UseGuards(JwtAuthGuard)
  async getPopularTracks(@CurrentUser() user: User) {
    return this.repositories.track.findMany(
      {},
      { sort: { listens: -1 }, limit: 7 },
    );
  }

  @Get('last-listens')
  @UseGuards(JwtAuthGuard)
  async getLastListensTracks(@CurrentUser() user: User) {
    return this.recommendationsService.getRecentListenedTracks(user);
  }
}
