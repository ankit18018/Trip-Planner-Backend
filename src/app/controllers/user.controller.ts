import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import UserDto, { UserLoginDto } from '../dto/user.dto';
import {
  userLoginSchema,
  userSignUpAdminSchema,
  userSignUpSchema,
  userUpdateJoiSchema,
} from '../joi-schema/user.joi-schema';
import Vp from '../pipes/vp';
import { Auth, ExtractJwt, IAuth } from '../decorators/authDetail.decorators';
import { AuthenticationGuard } from '../guards/authentication.guard';
import HttpResponse, { handleHTTPResponse } from '../libs/http-response';
import { UserRole } from '../../db/enum';
import { Roles } from '../decorators/roles.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/version')
  async getVersion() {
    return '1.0';
  }

  @Post('/signup')
  async signup(@Body(Vp.for(userSignUpSchema)) user: UserDto) {
    const data = await this.userService.signUp(user);
    return handleHTTPResponse(data);
  }

  @Post('/login')
  async login(@Body(Vp.for(userLoginSchema)) user: UserLoginDto) {
    const data = await this.userService.login(user);
    return handleHTTPResponse(data);
  }

  @Post('/logout')
  @UseGuards(AuthenticationGuard)
  async logout(@ExtractJwt() jwtToken: string) {
    const data = await this.userService.logout(jwtToken);
    return handleHTTPResponse(data);
  }

  @Post('/')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(AuthenticationGuard)
  async createUser(
    @Body(Vp.for(userSignUpAdminSchema)) user: UserDto,
    @Auth() auth: IAuth,
  ) {
    const data = await this.userService.signUp(user, auth);
    return handleHTTPResponse(data);
  }

  @Get('/')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(AuthenticationGuard)
  async getUsers(@Query('page') page = 0, @Auth() auth: IAuth) {
    const data = await this.userService.getUsers(page, auth);
    return handleHTTPResponse(data);
  }

  @Get('/current')
  @UseGuards(AuthenticationGuard)
  async getCurrentUser(@Auth() auth: IAuth) {
    return handleHTTPResponse(HttpResponse.success(auth.authUser.toJSON({})));
  }

  @Get('/:id')
  @UseGuards(AuthenticationGuard)
  async getUser(@Param('id') id: number, @Auth() auth: IAuth) {
    const data = await this.userService.getUser(id, auth);
    return handleHTTPResponse(data);
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(AuthenticationGuard)
  async delete(@Param('id') id: number, @Auth() auth: IAuth) {
    const data = await this.userService.deleteUser(id, auth);
    return handleHTTPResponse(data);
  }

  @Put('/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(AuthenticationGuard)
  async update(
    @Param('id') id: number,
    @Body(Vp.for(userUpdateJoiSchema)) user: UserDto,
    @Auth() auth: IAuth,
  ) {
    const data = await this.userService.updateUser(id, user, auth);
    return handleHTTPResponse(data);
  }
}
