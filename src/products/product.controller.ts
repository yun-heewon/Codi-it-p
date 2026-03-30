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
import { ProductService } from './product.service';
import { GetUser } from 'src/auth/get-user-decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dtos/create-product.dto';
import { DetailProductResponse } from './dtos/detail-product-response.dto';
import { GetProductsQueryDto } from './dtos/get-product-query.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { InquiryResponse } from './dtos/inquiry-response.dto';
import { CreateInquiryDto } from './dtos/create-inquiry.dto';
import { InquiriesListResponse } from './dtos/inquiries-list-response.dto';
import { SellerStoreGuard } from 'src/common/guards/seller-store.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { getMulterS3Config } from 'src/common/guards/configs/multer-s3.config';
import { ProductListResponse } from './dtos/product-list-responst.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), SellerStoreGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', getMulterS3Config()))
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @GetUser('id') userId: string,
    @Body() data: CreateProductDto,
    @UploadedFile() file?: Express.MulterS3.File,
  ): Promise<DetailProductResponse> {
    if (file) {
      data.image = file.key;
    }
    const product = await this.productService.createProduct(userId, data);
    return new DetailProductResponse(product);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async getProducts(@Query() query: GetProductsQueryDto) {
    const { list, totalCount } = await this.productService.getProducts(query);
    return new ProductListResponse(list, totalCount);
  }

  @Patch(':productId')
  @UseGuards(AuthGuard('jwt'), SellerStoreGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', getMulterS3Config()))
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @GetUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() data: UpdateProductDto,
    @UploadedFile() file?: Express.MulterS3.File,
  ): Promise<DetailProductResponse> {
    if (file) {
      data.image = file.key;
    }

    const updateProduct = await this.productService.updateProduct(
      userId,
      productId,
      data,
    );

    return new DetailProductResponse(updateProduct);
  }

  @Get(':productId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async getProductDetail(
    @Param('productId') productId: string,
  ): Promise<DetailProductResponse> {
    const product = await this.productService.getProductDetail(productId);

    return new DetailProductResponse(product);
  }

  @Delete(':productId')
  @UseGuards(AuthGuard('jwt'), SellerStoreGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(
    @GetUser('id') userId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    await this.productService.deleteProduct(userId, productId);
  }

  // 상품 문의 등록
  @Post(':productId/inquiries')
  @SetMetadata('role', 'BUYER')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async postProductInquiry(
    @GetUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() data: CreateInquiryDto,
  ): Promise<InquiryResponse> {
    const inquiry = await this.productService.postProductInquiry(
      userId,
      productId,
      data,
    );

    return new InquiryResponse(inquiry);
  }

  // 상품 문의 조회
  @Get(':productId/inquiries')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async getProductInquiry(
    @Param('productId') productId: string,
  ): Promise<InquiriesListResponse> {
    const inquiries = await this.productService.getProductInquiries(productId);

    return new InquiriesListResponse(inquiries);
  }
}
