import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { BasicSchema } from '../abstract/basic.schema';
import { ValidateNested } from 'class-validator';
import { Package } from '../package/package.schema';
import { PackageSubscription } from './nested/subscription.schema';
import { ApiHideProperty } from '@nestjs/swagger';

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
  @Prop({ default: false })
  verified?: boolean;

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

export { UserSchema, User, T_UserDocument };
