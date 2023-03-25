import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseIdValidator from 'mongoose-id-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseAutopopulate from 'mongoose-autopopulate';
import mongooseLeanGetters from 'mongoose-lean-getters';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { User, UserSchema } from './user/user.schema';
import { UserRepository } from './user/user.repository';
import { Repositories } from './db.repositories';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
        autoIndex: false,
        // connectionFactory: (connection: mongoose.Connection): any => {
        //   connection.plugin(mongooseIdValidator, { connection });
        //   connection.plugin(mongooseAutopopulate);
        //   connection.plugin(mongoosePaginate);
        //   connection.plugin(mongooseLeanGetters);
        //   connection.plugin(mongooseLeanVirtuals);
        //
        //   return connection;
        // },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [UserRepository, Repositories],
  exports: [Repositories],
})
export class DbModule {
  constructor(private readonly configService: ConfigService) {}
}
