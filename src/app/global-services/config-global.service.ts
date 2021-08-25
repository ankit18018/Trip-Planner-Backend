import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConnectionOptionsEnvReader } from 'typeorm/connection/options-reader/ConnectionOptionsEnvReader';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
@Injectable()
class ConfigGlobalService {
  public readonly envConfig: { [key in string]: any };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  getEnvironment(): 'production' | 'staging' | 'development' {
    return this.envConfig.NODE_ENV;
  }

  async loadTypeormConnection() {
    const envReader = new ConnectionOptionsEnvReader();
    const envConfig = await envReader.read();
    const envConfigObj = envConfig[0];
    const options: TypeOrmModuleOptions = {
      ...envConfigObj,
      entities: [
        path.join(__dirname, '../../', `${process.env.TYPEORM_ENTITIES}`),
      ],
      migrations: [],
    };
    return options;
  }

  get(key: string): string | undefined {
    return this.envConfig[key];
  }
}

export default ConfigGlobalService;
