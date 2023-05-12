import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { addDays } from 'date-fns';
import { Package } from '../../package/package.schema';

type T_PackageSubscriptionDocument = PackageSubscription & Document;
export enum SubscriptionStatusesEnum {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  PAUSED = 'paused',
  DELETED = 'deleted',
}

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
      return plainToInstance(PackageSubscription, res);
    },
  },
})
class PackageSubscription {
  constructor(partial: Partial<PackageSubscription | any> = {}) {
    Object.assign(this, partial);
  }

  @Expose()
  @Type(() => String)
  @Prop({
    required: true,
    index: 1,
    type: SchemaTypes.ObjectId,
    ref: Package.name,
  })
  packageId!: Types.ObjectId;

  @Expose()
  @Type(() => Date)
  @Prop({ index: 1, type: SchemaTypes.Date })
  availableTo?: Date;

  @Expose()
  @Prop({
    required: true,
    index: 1,
    type: String,
    enum: SubscriptionStatusesEnum,
  })
  subscriptionStatus!: SubscriptionStatusesEnum;

  @Expose()
  @Prop({ required: true })
  subscriptionEmail!: string;

  @Expose()
  @Prop({ required: true })
  subscriptionId!: string;

  @Expose()
  @Prop({ required: true, index: 1 })
  subscriptionPlanId!: string;

  @Expose()
  @Type(() => Date)
  @Prop({ index: 1, type: SchemaTypes.Date })
  nextBillAt?: Date;

  @Expose()
  @Type(() => Date)
  @Prop({ type: SchemaTypes.Date })
  pausedFrom?: Date;

  @Expose()
  @Prop()
  cancelUrl?: string;

  @Expose()
  @Prop()
  updateUrl?: string;

  @Expose()
  @Type(() => Date)
  @Prop({ type: SchemaTypes.Date, default: Date.now, index: 1 })
  updatedAt!: Date;

  @Expose()
  isAvailable!: boolean;

  @Expose()
  isPaused!: boolean;

  @Expose()
  isDeleted!: boolean;
}

const PackageSubscriptionSchema =
  SchemaFactory.createForClass(PackageSubscription);
PackageSubscriptionSchema.virtual('isAvailable').get(function (
  this: T_PackageSubscriptionDocument,
) {
  const now = new Date();
  const isActive = this.subscriptionStatus === SubscriptionStatusesEnum.ACTIVE;
  const isTrial = this.subscriptionStatus === SubscriptionStatusesEnum.TRIALING;
  const isStillAvailable = this.availableTo && this.availableTo > now;

  return isStillAvailable || isActive || isTrial;
});
PackageSubscriptionSchema.virtual('isPaused').get(function (
  this: T_PackageSubscriptionDocument,
) {
  const now = new Date();
  const pausedByDate = !!this.pausedFrom && addDays(this.pausedFrom, 1) <= now;

  return (
    pausedByDate || this.subscriptionStatus === SubscriptionStatusesEnum.PAUSED
  );
});
PackageSubscriptionSchema.virtual('isDeleted').get(function (
  this: T_PackageSubscriptionDocument,
) {
  return this.subscriptionStatus === SubscriptionStatusesEnum.DELETED;
});
export { PackageSubscription, PackageSubscriptionSchema };
