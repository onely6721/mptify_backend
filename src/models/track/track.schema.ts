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
  artist?: string;

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
  @Type(() => String)
  @Prop({
    required: false,
    index: 1,
    type: SchemaTypes.ObjectId,
    ref: User.name,
  })
  userId?: Types.ObjectId;
}

const TrackSchema = SchemaFactory.createForClass(Track);

export { TrackSchema, Track, T_TrackDocument };
