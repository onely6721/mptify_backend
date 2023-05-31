import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { BasicSchema } from '../abstract/basic.schema';
import { ValidateNested } from 'class-validator';
import { Package } from '../package/package.schema';
import { PackageSubscription } from './nested/subscription.schema';
import { ApiHideProperty } from '@nestjs/swagger';
import { Track } from '../track/track.schema';

type T_UserDocument = User & Document;
@Exclude()
@Schema({
  timestamps: true,
  collection: 'users',
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, res) => {
      return plainToInstance(User, res);
    },
  },
})
class User extends BasicSchema {
  @Expose()
  @Prop({
    required: true,
    index: { unique: true },
    maxLength: 255,
  })
  email!: string;

  @ApiHideProperty()
  @Expose({ toPlainOnly: true })
  @Prop({ required: true })
  passwordHash!: string;

  @Expose()
  @Prop({ required: true, maxLength: 255 })
  firstName!: string;

  @Expose()
  @Prop({ maxLength: 255 })
  lastName?: string;

  @Expose()
  @Prop({ maxLength: 255 })
  artistName?: string;

  @Expose()
  @Prop()
  avatar?: string;

  @Expose()
  @ValidateNested()
  @Type(() => PackageSubscription)
  @Prop({ type: PackageSubscription })
  subscription?: PackageSubscription;

  @Expose()
  @Type(() => Package)
  subscriptionPackage?: Package;

  @Expose()
  @Prop({ default: false })
  isVerifiedArtist!: boolean;

  @Expose()
  @Prop({ default: 0 })
  listens!: number;

  @Expose()
  @Type(() => String)
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Track', default: [] })
  likedTracksIds?: Types.ObjectId[];

  @Expose()
  @Type(() => Track)
  likedTracks?: Track[];

  @Expose()
  @Type(() => Date)
  @Prop({ type: SchemaTypes.Date, default: Date.now, index: 1 })
  lastListenedSongDate?: Date;

  @Expose()
  @Prop({ default: false })
  isAdmin!: boolean;

  @Expose()
  isSubscribed?: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.virtual('subscriptionPackage', {
  ref: Package.name,
  localField: 'subscription.packageId',
  foreignField: '_id',
  justOne: true,
  autopopulate: true,
});

UserSchema.virtual('likedTracks', {
  ref: 'Track',
  localField: 'likedTracksIds',
  foreignField: '_id',
  autopopulate: true,
});

export { UserSchema, User, T_UserDocument };
