import { UserRole } from '../../db/enum';
import { ensureProgram } from 'ts-loader/dist/utils';

export default interface UserDto {
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}
