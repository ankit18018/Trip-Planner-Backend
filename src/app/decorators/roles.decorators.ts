import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../db/enum';

export const Roles = (...UserRoles: UserRole[]) =>
  SetMetadata('roles', UserRoles);
