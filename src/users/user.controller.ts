import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUser } from '../auth/get-user-decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { getMulterS3Config } from '../common/guards/configs/multer-s3.config';
import { UserResponseDto } from './dtos/user-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  async createUser(@Body() data: CreateUserDto): Promise<UserResponseDto> {
    const newUser = await this.userService.createUser(data);
    return new UserResponseDto(newUser);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async getUser(@GetUser('id') userId: string): Promise<UserResponseDto> {
    const user = await this.userService.getUser(userId);
    return new UserResponseDto(user);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', getMulterS3Config()))
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @GetUser('id') userId: string,
    @Body() data: UpdateUserDto,
    @UploadedFile() file?: Express.MulterS3.File,
  ): Promise<UserResponseDto> {
    if (file) {
      data.image = file.key;
    }
    const updatedUser = await this.userService.updateUser(userId, data);
    return new UserResponseDto(updatedUser);
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
