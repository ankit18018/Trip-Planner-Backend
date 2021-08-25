import { Global, Module } from '@nestjs/common';
import ConfigGlobalService from '../global-services/config-global.service';
@Global()
@Module({
  providers: [
    {
      provide: ConfigGlobalService,
      useValue: new ConfigGlobalService(`.env`),
    },
  ],
  exports: [ConfigGlobalService],
})
export default class GlobalModule {}
