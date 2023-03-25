import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export const TransformToObjectId = (): any => {
  return Transform(({ value }) => {
    if (
      value instanceof Types.ObjectId ||
      (Types.ObjectId.isValid(value) &&
        new Types.ObjectId(value).toString() === value)
    ) {
      return new Types.ObjectId(value);
    }

    return value;
  });
};

export function TransformBooleanLike(
  values: any[] = [true, 'enabled', 'true', '1', 'on'],
) {
  return Transform(({ obj, key }) => {
    return values.includes(obj[key]);
  });
}
