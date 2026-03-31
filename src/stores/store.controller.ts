import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dtos/create.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decorator';
import { StoreResponseDto } from './dtos/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';
import { UpdateStoreDto } from './dtos/update.dto';
import { DetailResponseDto } from './dtos/detail-response.dto';
import { MyStoreResponseDto } from './dtos/my-store-response.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { MyStoreProductResponseDto } from './dtos/my-store-product-response.dto';
import { StoreLikeResponseDto } from './dtos/store-like-response.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SellerStoreGuard } from 'src/common/guards/seller-store.guard';
import { getMulterS3Config } from 'src/common/guards/configs/multer-s3.config';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @SetMetadata('role', 'SELLER')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', getMulterS3Config()))
  @HttpCode(HttpStatus.CREATED)
  async createStore(
    @GetUser('id') userId: string,
    @Body() data: CreateStoreDto,
    @UploadedFile() file?: Express.MulterS3.File,
  ): Promise<StoreResponseDto> {
    if (file) {
      data.image = file.key;
    }
    const result = await this.storeService.createStore(userId, data);
    return new StoreResponseDto(result);
  }

  @Patch(':storeId')
  @UseGuards(AuthGuard('jwt'), SellerStoreGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', getMulterS3Config()))
  @HttpCode(HttpStatus.OK)
  async updateStore(
    @Param('storeId') storeId: string,
    @GetUser('id') userId: string,
    @Body() data: UpdateStoreDto,
    @UploadedFile() file?: Express.MulterS3.File,
  ): Promise<StoreResponseDto> {
    if (file) {
      data.image = file.key;
    }
    const updatedStore = await this.storeService.updateStore(
      storeId,
      userId,
      data,
    );
    return new StoreResponseDto(updatedStore);
  }

  @Get(':storeId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async getStoreDetails(
    @Param('storeId') storeId: string,
  ): Promise<DetailResponseDto> {
    const store = await this.storeService.getStoreById(storeId);
    return new DetailResponseDto(store);
  }

  @Get('detail/my')
  @UseGuards(AuthGuard('jwt'), SellerStoreGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async getMyStore(@GetUser('id') userId: string): Promise<MyStoreResponseDto> {
    const myStore = await this.storeService.getMyStore(userId);
    return new MyStoreResponseDto(myStore);
  }

  @Get('detail/my/product')
  @UseGuards(AuthGuard('jwt'), SellerStoreGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async getMyStoreProducts(
    @GetUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<MyStoreProductResponseDto> {
    const { list, totalCount } = await this.storeService.getMyStoreProducts(
      userId,
      Number(page),
      Number(pageSize),
    );

    return new MyStoreProductResponseDto({
      list: list.map((item) => new ProductResponseDto(item)),
      totalCount,
    });
  }

  @Post(':storeId/favorite')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async registerStoreLike(
    @GetUser('id') userId: string,
    @Param('storeId') storeId: string,
  ) {
    const storeLike = await this.storeService.registerStoreLike(
      userId,
      storeId,
    );
    return new StoreLikeResponseDto(storeLike!);
  }

  @Delete(':storeId/favorite')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async deleteStoreLike(
    @GetUser('id') userId: string,
    @Param('storeId') storeId: string,
  ) {
    const deleteLike = await this.storeService.deleteStoreLike(userId, storeId);

    return new StoreLikeResponseDto(deleteLike!);
  }
}
