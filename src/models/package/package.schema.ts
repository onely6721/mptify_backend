import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { BasicSchema } from '../abstract/basic.schema';

type T_PackageDocument = Package & Document;

@Exclude()
@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, res) => {
      return plainToInstance(Package, res);
    },
  },
})
class Package extends BasicSchema {
  @Expose()
  @IsString()
  @Prop({ required: true, index: { unique: true } })
  planId!: string;

  @Expose()
  @IsString()
  @Prop({ required: true })
  planName!: string;

  @Expose()
  @IsString()
  @Prop({ required: true })
  planBillingType!: string;

  @Expose()
  @IsNumber()
  @Prop({ required: true })
  planBillingPeriod!: number;

  @Expose()
  @IsNumber()
  @Prop({ required: true, default: 1 })
  rank!: number;

  @Expose()
  @Prop()
  displayName?: string;

  @Expose()
  @Prop()
  description?: string;
}

const PackageSchema = SchemaFactory.createForClass(Package);

export { PackageSchema, Package, T_PackageDocument };
