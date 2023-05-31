import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { BasicSchema } from '../abstract/basic.schema';
import { User } from '../user/user.schema';
import { TrackGenreEnum } from './track.types';

type T_TrackDocument = Track & Document;
@Exclude()
@Schema({
  timestamps: true,
  collection: 'tracks',
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, res) => {
      return plainToInstance(Track, res);
    },
  },
})
class Track extends BasicSchema {
  @Expose()
  @Prop()
  title!: string;

  @Expose()
  @Prop()
  cover?: string;

  @Expose()
  @Prop()
  audio?: string;

  @Expose()
  @Prop({ type: String, enum: TrackGenreEnum, default: TrackGenreEnum.ANOTHER })
  genre!: TrackGenreEnum;

  @Expose()
  @Prop()
  listens?: number;

  @Expose()
  @Prop()
  likes?: number;

  @Expose()
  @Type(() => User)
  artist?: User;

  @Expose()
  @Type(() => User)
  subArtists?: User[];

  @Expose()
  @Type(() => String)
  @Prop({
    required: false,
    index: 1,
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  userId?: Types.ObjectId;

  @Expose()
  @Type(() => String)
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'User', default: [] })
  subArtistIds!: Types.ObjectId[];
}

const TrackSchema = SchemaFactory.createForClass(Track);

TrackSchema.virtual('artist', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  autopopulate: true,
});

TrackSchema.virtual('subArtists', {
  ref: 'User',
  localField: 'subArtistIds',
  foreignField: '_id',
  autopopulate: true,
});

export { TrackSchema, Track, T_TrackDocument };
