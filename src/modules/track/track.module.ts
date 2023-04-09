import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  imports: [],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [],
})
export class TrackModule {}
