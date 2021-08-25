import { Global, Module } from '@nestjs/common';
import JWTUtilService from '../utilities-services/jwt-util.service';

@Global()
@Module({
  providers: [JWTUtilService],
  exports: [JWTUtilService],
})
export default class UtilitiesModule {}
