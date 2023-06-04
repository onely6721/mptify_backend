import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TrackModule } from './track/track.module';
import { PlaylistModule } from './playlist/playlist.module';
import { PaymentModule } from './payment/payment.module';
import { ArtistModule } from './artists/artist.module';
import { RecommendationsModule } from './ recommendations/recommendations.module';
import { UserModule } from './user/user.module';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    AuthModule,
    TrackModule,
    PlaylistModule,
    PaymentModule,
    AlbumModule,
    ArtistModule,
    UserModule,
    RecommendationsModule,
  ],
  controllers: [],
  providers: [],
})
export class EndpointsModule {}
