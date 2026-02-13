import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUser } from 'src/auth/get-user-decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() data: CreateUserDto) {
    return await this.userService.createUser(data);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getUser(@GetUser('id') userId: string) {
    return await this.userService.getUser(userId);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateUser(@GetUser('id') userId: string, @Body() data: UpdateUserDto) {
    return await this.userService.updateUser(userId, data);
  }

  @Get('me/likes')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getUserLikedStores(@GetUser('id') userId: string) {
    return await this.userService.getUserLikedStores(userId);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@GetUser('id') userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
