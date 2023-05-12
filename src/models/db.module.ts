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

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
        autoIndex: false,
        // connectionFactory: (connection: mongoose.Connection): any => {
        //   connection.plugin(mongooseIdValidator, { connection });
        //   connection.plugin(mongooseAutopopulate);
        //   connection.plugin(mongoosePaginate);
        //   connection.plugin(mongooseLeanGetters);
        //   connection.plugin(mongooseLeanVirtuals);
        //
        //   return connection;
        // },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Track.name, schema: TrackSchema },
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Package.name, schema: PackageSchema },
    ]),
  ],
  controllers: [],
  providers: [
    UserRepository,
    TrackRepository,
    PlaylistRepository,
    PackageRepository,
    Repositories,
  ],
  exports: [Repositories],
})
export class DbModule {
  constructor(private readonly configService: ConfigService) {}
}
