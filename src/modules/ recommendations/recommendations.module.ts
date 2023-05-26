import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';

@Module({
  imports: [],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [],
})
export class RecommendationsModule {}
