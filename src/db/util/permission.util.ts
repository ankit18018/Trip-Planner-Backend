import UserDto from '../../app/dto/user.dto';
import { UserRole } from '../enum';
import { IAuth } from '../../app/decorators/authDetail.decorators';
import UserEntity from '../entities/user.entity';
import TripEntity from '../entities/trip.entity';

export default class PermissionUtil {
  static canCUDUser(authUser, user) {
    if (authUser.role === 'admin') return true;
    else if (
      authUser.role === 'manager' &&
      ['manager', 'regular'].includes(user.role)
    )
      return true;
    else return false;
  }
  static canSignUp(user: UserDto, auth?: IAuth) {
    if (!auth && user.role === UserRole.REGULAR) return true;
    if (auth?.authUser?.role === UserRole.ADMIN) return true;
    else if (
      auth?.authUser?.role === UserRole.MANAGER &&
      user.role === UserRole.REGULAR
    )
      return true;
    return false;
  }

  static canDeleteUser(auth: IAuth, user: UserEntity) {
    if (auth.authUser.role === 'admin') return true;
    if (
      auth.authUser.role === UserRole.MANAGER &&
      user.role === UserRole.REGULAR
    )
      return true;
    return false;
  }

  static canUpdateUser(auth: IAuth, user: UserEntity, updateParams: UserDto) {
    if (auth.authUser.role === 'admin') return true;
    if (
      auth.authUser.role === UserRole.MANAGER &&
      user.role === UserRole.REGULAR &&
      updateParams.role === UserRole.REGULAR
    )
      return true;
    return false;
  }

  static canSignUpAdminAndManager(auth: IAuth, user: UserDto) {
    if (auth.authUser.role === UserRole.ADMIN) return true;
    else if (
      auth.authUser.role === UserRole.MANAGER &&
      user.role === UserRole.REGULAR
    )
      return true;
    else return false;
  }
  static canRUDTrip(auth: IAuth, trip: TripEntity) {
    if (auth.authUser.role === UserRole.ADMIN) return true;
    else if (auth.authUser.id === trip.userId) return true;
    else return false;
  }
}
