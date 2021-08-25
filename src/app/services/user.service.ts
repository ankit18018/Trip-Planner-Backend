import { Injectable } from '@nestjs/common';
import TripDto, { UserLoginDto } from '../dto/user.dto';
import UserDto from '../dto/user.dto';
import UserEntity from '../../db/entities/user.entity';
import HttpResponse from '../libs/http-response';
import ErrorMessageConstants from '../consts/error-message.consts';
import { compareBcrypt, secureBcrypt } from '../../db/util/bcrypt.util';
import JWTUtilService from '../utilities-services/jwt-util.service';
import ExpiredTokenEntity from '../../db/entities/expired-token.entity';
import SuccessMessageConstants from '../consts/success-message.consts';
import PermissionUtil from '../../db/util/permission.util';
import { IAuth } from '../decorators/authDetail.decorators';
import * as Lodash from 'lodash';
import { TripService } from './trip.service';
import GenUtil from '../../db/util/gen.util';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtUtilService: JWTUtilService,
    private readonly tripService: TripService,
  ) { }

  async signUp(user: UserDto, auth?: IAuth) {
    if (!PermissionUtil.canSignUp(user, auth)) {
      return HttpResponse.forbidden(ErrorMessageConstants.ForbiddenResource);
    }
    user.email = user.email.toLowerCase();
    const emailExist = await UserEntity.findOne({
      where: { email: user.email },
    });
    if (emailExist) return HttpResponse.error(ErrorMessageConstants.EmailExits);
    const newUser: UserEntity = new UserEntity();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.password = await secureBcrypt(user.password);
    newUser.role = user.role;
    await newUser.save();

    const jwtToken = await this.jwtUtilService.generateJWTToken(newUser);

    if (auth) {
      return HttpResponse.created({ ...newUser.toJSON({}) }, SuccessMessageConstants.UserCreatedSuccess);
    }
    return HttpResponse.created({ ...newUser.toJSON({}), jwtToken }, SuccessMessageConstants.UserCreatedSuccess);
  }

  async login(user: UserLoginDto) {
    const autheticatedUser: UserEntity = await UserEntity.findOne({
      where: { email: user.email.toLocaleLowerCase() },
    });

    if (autheticatedUser) {
      const passwordMatch = await compareBcrypt(
        user.password,
        autheticatedUser.password,
      );

      if (passwordMatch) {
        const jwtToken: string = await this.jwtUtilService.generateJWTToken(
          autheticatedUser,
        );
        return HttpResponse.success({
          ...autheticatedUser.toJSON({}),
          jwtToken,
        }, SuccessMessageConstants.UserLoggedInSuccess);
      } else {
        return HttpResponse.notFound();
      }
    } else return HttpResponse.notFound();
  }

  async logout(jwtToken: string) {
    const expiredToken: ExpiredTokenEntity = new ExpiredTokenEntity();
    expiredToken.expiredJwtToken = jwtToken;
    await expiredToken.save();
    return HttpResponse.success(SuccessMessageConstants.UserLoggedOutSuccess);
  }

  async getUsers(page: number, auth: IAuth) {
    console.log(page);
    const Users: UserEntity[] = await UserEntity.find({
      where: {},
      ...GenUtil.getOffsetAndLimit(page),
      order: {
        id: 'DESC',
      },
    });

    return HttpResponse.success(Users.map((user) => user.toJSON({})));
  }

  async getUser(id: number, auth: IAuth) {
    const user: UserEntity = await UserEntity.findOne({ id });
    if (!user) return HttpResponse.notFound(ErrorMessageConstants.UserNotFound);
    return HttpResponse.success(user.toJSON({}));
  }
  async deleteUser(id: number, auth: IAuth) {
    const user: UserEntity = await UserEntity.findOne({ id });
    if (!user) return HttpResponse.notFound(ErrorMessageConstants.UserNotFound);

    if (!PermissionUtil.canDeleteUser(auth, user)) {
      return HttpResponse.forbidden(ErrorMessageConstants.ForbiddenResource);
    }
    await this.tripService.deleteAllTripsOfUsers(user.id);
    await user.remove();

    return HttpResponse.success(
      {},
      ErrorMessageConstants.UserDeletedSuccessfully,
    );
  }

  async updateUser(id: number, updateParams: UserDto, auth: IAuth) {
    const user: UserEntity = await UserEntity.findOne({ id });
    if (!user) {
      return HttpResponse.notFound(ErrorMessageConstants.UserNotFound);
    }
    if (!PermissionUtil.canUpdateUser(auth, user, updateParams))
      return HttpResponse.forbidden(ErrorMessageConstants.ForbiddenResource);

    updateParams.email = updateParams.email.toLowerCase();
    if (user.email != updateParams.email) {
      const emailExist = await UserEntity.findOne({
        email: updateParams.email,
      });
      if (emailExist)
        return HttpResponse.error(ErrorMessageConstants.EmailExits);
    }

    user.name = Lodash.isNil(updateParams.name) ? user.name : updateParams.name;
    user.email = Lodash.isNil(updateParams.email)
      ? user.email
      : updateParams.email;
    user.password = Lodash.isNil(updateParams.password)
      ? user.password
      : await secureBcrypt(updateParams.password);
    user.role = Lodash.isNil(updateParams.role) ? user.role : updateParams.role;

    await user.save();
    return HttpResponse.success(
      user.toJSON({}),
      SuccessMessageConstants.UserUpdatedSuccess,
    );
  }
}
