import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as JWT from 'jsonwebtoken';

import ErrorMessageConstants from '../consts/error-message.consts';
import ConfigGlobalService from '../global-services/config-global.service';
import { UserRole } from '../../db/enum';
import ExpiredTokenEntity from '../../db/entities/expired-token.entity';
import UserEntity from '../../db/entities/user.entity';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigGlobalService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const jwtToken = request?.headers?.jwttoken;

    const isExpiredJwtToken: ExpiredTokenEntity = await ExpiredTokenEntity.findOne(
      { expiredJwtToken: jwtToken },
    );
    if (isExpiredJwtToken) {
      throw new UnauthorizedException(ErrorMessageConstants.LogggetOutError);
    }

    const user: UserEntity = await this.validateJWTToken(jwtToken);

    if (user) {
      const roleMatch = requiredRoles
        ? requiredRoles.some((role) => user.role?.includes(role))
        : true;
      if (roleMatch) {
        request.user = user;
        request.jwtToken = jwtToken;
        return true;
      }
      return false;
    }

    throw new HttpException(
      {
        message: 'Unauthorized user',
        error: 'Unauthorized',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  public async validateJWTToken(jwtToken: string): Promise<UserEntity> {
    try {
      const { userId } = JWT.verify(
        jwtToken,
        this.configService.get('JWT_SECRET'),
      ) as IJwtPayload;
      const user = await UserEntity.findOne({ id: userId });
      if (!user) {
        return undefined;
      } else return user;
    } catch (e) {
      return undefined;
    }
  }
}

export interface IJwtPayload {
  userId: number;
  time: number;
}
