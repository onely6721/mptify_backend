import { Types } from 'mongoose';

export type T_CreatePartial<T> = Omit<
  {
    [P in keyof T]?: T[P] extends Types.ObjectId | undefined
      ? Types.ObjectId | string
      : T[P] extends Date | undefined
      ? Date | number
      : T[P] extends Types.ObjectId[] | undefined
      ? (Types.ObjectId | string)[]
      : T[P];
  },
  '_id' | 'id'
>;
