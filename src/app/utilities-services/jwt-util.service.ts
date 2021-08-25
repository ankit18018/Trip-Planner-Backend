import { Injectable } from '@nestjs/common';
import * as JWT from 'jsonwebtoken';
import { IJwtPayload } from '../guards/authentication.guard';
import ConfigGlobalService from '../global-services/config-global.service';
import UserEntity from '../../db/entities/user.entity';

@Injectable()
export default class JWTUtilService {
  constructor(private readonly configService: ConfigGlobalService) {}

  public async generateJWTToken(user: UserEntity) {
    const payload: IJwtPayload = {
      userId: user.id,
      time: Date.now(),
    };
    return JWT.sign(payload, this.configService.get('JWT_SECRET'), {
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
  }
}
