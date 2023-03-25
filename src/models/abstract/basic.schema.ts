import { SchemaTypes, Types } from 'mongoose';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { TransformToObjectId } from '../../common/decorators/transform';
import { Prop } from '@nestjs/mongoose';

export abstract class BaseSchema {
  /** @deprecated Use id */
  @Expose({ toClassOnly: true })
  @IsOptional()
  @TransformToObjectId()
  _id!: Types.ObjectId;

  @Expose()
  @IsOptional()
  id!: string;

  @Exclude()
  @IsOptional()
  __v?: any;
}

export abstract class BasicSchema extends BaseSchema {
  @Expose()
  @IsOptional()
  @Type(() => Date)
  @Prop({ type: SchemaTypes.Date, default: Date.now, index: 1 })
  createdAt!: Date;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  @Prop({ type: SchemaTypes.Date, default: Date.now, index: 1 })
  updatedAt!: Date;
}
