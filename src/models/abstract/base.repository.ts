import type {
  Document,
  FilterQuery,
  Error,
  AnyObject,
  UpdateQuery,
  Types,
  QueryOptions,
  PaginateModel,
  PopulateOptions,
} from 'mongoose';
import type { UpdateResult, DeleteResult } from 'mongodb';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { T_CreatePartial } from '../db.types';
import type { Repositories } from '../db.repositories';

@Injectable()
export abstract class BaseRepository<C, T extends C & Document> {
  protected abstract readonly Model: PaginateModel<T>;

  protected root!: Repositories;

  setRoot(repositories: Repositories): this {
    this.root = repositories;

    return this;
  }

  protected static throwMongoError(err: Error): void {
    throw new InternalServerErrorException(err, err.message);
  }

  async distinct<R = any>(
    field: string,
    filter?: FilterQuery<T>,
  ): Promise<R[]> {
    return this.Model.distinct(field, filter).exec();
  }

  async count(filter: FilterQuery<T>, limit?: number): Promise<number> {
    const cursor = this.Model.countDocuments(filter);

    if (limit) {
      void cursor.limit(limit);
    }

    return cursor.exec();
  }

  async findMany<P>(
    filter: FilterQuery<T> = {},
    options?: QueryOptions,
    populate?: PopulateOptions | Array<PopulateOptions>,
    projection?: any | undefined,
  ): Promise<T[]> {
    const cursor = this.Model.find(filter, projection, options);

    if (populate) {
      void cursor.populate<P>(populate);
    }

    return cursor.exec();
  }

  async findById<P>(
    id: string | Types.ObjectId,
    options?: QueryOptions,
    populate?: PopulateOptions | Array<PopulateOptions>,
    projection?: any | undefined,
  ): Promise<T | null> {
    const cursor = this.Model.findById(id, projection, options);

    if (populate) {
      void cursor.populate<P>(populate);
    }

    return cursor.exec();
  }

  async findOne<P>(
    filter: FilterQuery<T>,
    options?: QueryOptions,
    populate?: PopulateOptions | Array<PopulateOptions>,
    projection?: any | undefined,
  ): Promise<T | null> {
    const cursor = this.Model.findOne(filter, projection, options);

    if (populate) {
      void cursor.populate<P>(populate);
    }

    return cursor.exec();
  }

  createModel(doc: T_CreatePartial<C> & AnyObject): T {
    return new this.Model(doc);
  }

  async create(doc: T_CreatePartial<C> & AnyObject): Promise<T> {
    const entity = this.createModel(doc);

    return entity.save();
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.Model.findByIdAndUpdate(id, update, {
      ...options,
      new: true,
    }).exec();
  }

  async updateOne(
    query: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.Model.findOneAndUpdate(query, update, {
      ...options,
      new: true,
    }).exec();
  }

  async updateOrCreate(
    query: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T> {
    return this.Model.findOneAndUpdate(query, update, {
      ...options,
      upsert: true,
      new: true,
    }).exec();
  }

  async updateMany(
    query: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdateResult> {
    return this.Model.updateMany(query, update, options).exec();
  }

  async deleteById(
    id: string | Types.ObjectId,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.Model.findByIdAndDelete(id, options).exec();
  }

  async deleteOne(
    query: FilterQuery<T>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.Model.findOneAndDelete(query, options).exec();
  }

  async deleteMany(
    query: FilterQuery<T>,
    options?: QueryOptions,
  ): Promise<DeleteResult> {
    return this.Model.deleteMany(query, options).exec();
  }
}
