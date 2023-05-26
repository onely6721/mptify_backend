import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { BasicSchema } from '../abstract/basic.schema';
import { Track } from '../track/track.schema';
import { User } from '../user/user.schema';

type T_ListenDocument = Listen & Document;

@Exclude()
@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, res) => {
      return plainToInstance(Listen, res);
    },
  },
})
class Listen extends BasicSchema {
  @Expose()
  @Type(() => Date)
  @Prop({ type: SchemaTypes.Date, default: Date.now, index: 1 })
  listenDate?: Date;

  @Expose()
  @Type(() => String)
  @Prop({
    required: false,
    type: SchemaTypes.ObjectId,
    ref: Track.name,
  })
  trackId?: Types.ObjectId;

  @Expose()
  @Type(() => Track)
  track?: Track;

  @Expose()
  @Type(() => String)
  @Prop({
    required: false,
    type: SchemaTypes.ObjectId,
    ref: User.name,
  })
  userId?: Types.ObjectId;

  @Expose()
  @Type(() => User)
  user?: User;
}

const ListenSchema = SchemaFactory.createForClass(Listen);

ListenSchema.virtual('user', {
  ref: User.name,
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  autopopulate: true,
});

ListenSchema.virtual('track', {
  ref: Track.name,
  localField: 'trackId',
  foreignField: '_id',
  justOne: true,
  autopopulate: true,
});

export { ListenSchema, Listen, T_ListenDocument };
