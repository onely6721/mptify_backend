import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../abstract/base.repository';
import { Package, T_PackageDocument } from './package.schema';

@Injectable()
export class PackageRepository extends BaseRepository<
  Package,
  T_PackageDocument
> {
  constructor(
    @InjectModel(Package.name)
    protected readonly Model: PaginateModel<T_PackageDocument>,
  ) {
    super();
  }
}
