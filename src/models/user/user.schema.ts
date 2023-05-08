import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { BasicSchema } from '../abstract/basic.schema';

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

  @Expose({ toClassOnly: true })
  @Prop({ required: true })
  passwordHash!: string;

  @Expose()
  @Prop({ required: true, maxLength: 255 })
  firstName!: string;

  @Expose()
  @Prop({ maxLength: 255 })
  lastName?: string;

  @Expose()
  @Prop({ default: false })
  verified?: boolean;

  @Expose()
  isAdmin?: boolean;

  @Expose()
  isSubscribed?: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema, User, T_UserDocument };
