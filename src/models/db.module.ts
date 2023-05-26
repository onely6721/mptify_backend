import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.schema';
import { UserRepository } from './user/user.repository';
import { Repositories } from './db.repositories';
import { TrackRepository } from './track/track.repository';
import { Track, TrackSchema } from './track/track.schema';
import { Playlist, PlaylistSchema } from './playlist/playlist.schema';
import { PlaylistRepository } from './playlist/playlist.repository';
import { Package, PackageSchema } from './package/package.schema';
import { PackageRepository } from './package/package.repository';
import { AlbumRepository } from './album/album.repository';
import { Album, AlbumSchema } from './album/album.schema';
import * as mongooseAutoPopulate from 'mongoose-autopopulate';
import * as mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { Listen, ListenSchema } from './listen/listen.schema';
import { ListenRepository } from './listen/listen.repository';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
        autoIndex: false,
        connectionFactory: (connection: any): any => {
          connection.plugin(mongooseAutoPopulate);
          connection.plugin(mongooseLeanVirtuals);

          return connection;
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Track.name, schema: TrackSchema },
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Package.name, schema: PackageSchema },
      { name: Listen.name, schema: ListenSchema },
      { name: Album.name, schema: AlbumSchema },
    ]),
  ],
  controllers: [],
  providers: [
    UserRepository,
    TrackRepository,
    PlaylistRepository,
    PackageRepository,
    AlbumRepository,
    ListenRepository,
    Repositories,
  ],
  exports: [Repositories],
})
export class DbModule {
  constructor(private readonly configService: ConfigService) {}
}
