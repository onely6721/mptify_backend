import { Injectable } from '@nestjs/common';
import { UserRepository } from './user/user.repository';
import { TrackRepository } from './track/track.repository';
import { PlaylistRepository } from './playlist/playlist.repository';
import { PackageRepository } from './package/package.repository';
import { AlbumRepository } from './album/album.repository';
import { ListenRepository } from './listen/listen.repository';

@Injectable()
export class Repositories {
  constructor(
    readonly user: UserRepository,
    readonly track: TrackRepository,
    readonly playlist: PlaylistRepository,
    readonly packages: PackageRepository,
    readonly album: AlbumRepository,
    readonly listen: ListenRepository,
  ) {
    user.setRoot(this);
    track.setRoot(this);
    playlist.setRoot(this);
    packages.setRoot(this);
    listen.setRoot(this);
    album.setRoot(this);
  }
}
