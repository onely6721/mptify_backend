import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { BasicSchema } from '../abstract/basic.schema';
import { IsString } from 'class-validator';
import { User } from '../user/user.schema';
import { Track } from '../track/track.schema';

type T_PlaylistDocument = Playlist & Document;
@Exclude()
@Schema({
  timestamps: true,
  collection: 'playlists',
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, res) => {
      return plainToInstance(Playlist, res);
    },
  },
})
class Playlist extends BasicSchema {
  @Expose()
  @IsString()
  title?: string;

  @Expose()
  @IsString()
  coverImage?: string;

  @Expose()
  @Type(() => Track)
  tracks!: Track[];

  @Expose()
  @Type(() => String)
  @Prop({
    required: true,
    index: 1,
    type: SchemaTypes.ObjectId,
    ref: User.name,
  })
  userId!: Types.ObjectId;
}

const PlaylistSchema = SchemaFactory.createForClass(Track);

export { PlaylistSchema, Playlist, T_PlaylistDocument };
