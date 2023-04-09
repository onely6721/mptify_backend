import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TrackModule } from './track/track.module';
import { PlaylistModule } from './playlist/playlist.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [AuthModule, TrackModule, PlaylistModule, PaymentModule],
  controllers: [],
  providers: [],
})
export class EndpointsModule {}
