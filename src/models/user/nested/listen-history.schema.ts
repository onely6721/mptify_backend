import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Track } from '../../track/track.schema';

type T_ListenDocument = Listen & Document;

@Exclude()
@Schema({
  _id: false,
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
class Listen {
  constructor(partial: Partial<Listen | any> = {}) {
    Object.assign(this, partial);
  }
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
}

const ListenSchema = SchemaFactory.createForClass(Listen);
//
// ListenSchema.virtual('track', {
//   ref: Track.name,
//   localField: 'tracksId',
//   foreignField: '_id',
//   justOne: true,
//   autopopulate: true,
// });

export { Listen, ListenSchema };
