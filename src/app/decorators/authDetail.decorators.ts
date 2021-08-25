import { createParamDecorator } from '@nestjs/common';
import UserEntity from 'src/db/entities/user.entity';

export interface IAuth {
  authUser: UserEntity;
}

export const Auth = createParamDecorator(
  (data, context): IAuth => {
    const request = context.switchToHttp().getRequest();
    return {
      authUser: request.user,
    };
  },
);

export const ExtractJwt = createParamDecorator(
  (data, context): IAuth => {
    const request = context.switchToHttp().getRequest();
    return request.jwtToken;
  },
);
