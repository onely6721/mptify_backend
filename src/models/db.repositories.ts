import { Injectable } from '@nestjs/common';
import { UserRepository } from './user/user.repository';
import { TrackRepository } from './track/track.repository';
import { PlaylistRepository } from './playlist/playlist.repository';

@Injectable()
export class Repositories {
  constructor(
    readonly user: UserRepository,
    readonly track: TrackRepository,
    readonly playlist: PlaylistRepository,
  ) {
    user.setRoot(this);
    track.setRoot(this);
    playlist.setRoot(this);
  }
}
