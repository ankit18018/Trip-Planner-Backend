import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConfigGlobalService from './app/global-services/config-global.service';
import GlobalModule from './app/modules/global.module';
import { UserModule } from './app/modules/user.module';
import { TripsModule } from './app/modules/trips.module';
import UtilitiesModule from './app/modules/utilites.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './app/interceptors/all-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: function (config: ConfigGlobalService) {
        return config.loadTypeormConnection();
      },
      inject: [ConfigGlobalService],
    }),
    GlobalModule,
    UserModule,
    TripsModule,
    UtilitiesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
