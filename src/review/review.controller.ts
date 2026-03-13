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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetUser } from 'src/auth/get-user-decorator';
import { ReviewCreateDto } from './dtos/create.dto';
import { ReviewResponseDto } from './dtos/response.dto';
import { ReviewUpdateDto } from './dtos/update.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReviewDetailResponseDto } from './dtos/detail-response.dto';
import { ReviewListResponse } from './dtos/list-response.dto';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('product/:productId/reviews')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async createReview(
    @GetUser('id') userId: string,
    @Body() data: ReviewCreateDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.reviewService.createReview(userId, data);

    return new ReviewResponseDto(review);
  }

  @Patch('review/:reviewId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async updateReview(
    @GetUser('id') userId: string,
    @Param('reviewId') reviewId: string,
    @Body() data: ReviewUpdateDto,
  ): Promise<ReviewResponseDto> {
    const updatedReview = await this.reviewService.updateReview(
      reviewId,
      userId,
      data,
    );

    return new ReviewResponseDto(updatedReview);
  }

  @Get('review/:reviewId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getReviewDetails(
    @Param('reviewId') reviewId: string,
  ): Promise<ReviewDetailResponseDto> {
    const review = await this.reviewService.getReviewsDetail(reviewId);

    return new ReviewDetailResponseDto(review);
  }

  @Delete('review/:reviewId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @GetUser('id') userId: string,
  ): Promise<void> {
    await this.reviewService.deleteReview(reviewId, userId);
  }

  @Get('product/:productId/reviews')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getReviewList(
    @Param('productId') productId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ReviewListResponse> {
    const validatedPage = Number(page);
    const validatedLimit = Number(limit);

    const { items, total } = await this.reviewService.getProductReviews(
      productId,
      validatedLimit,
      validatedPage,
    );

    return new ReviewListResponse({
      items,
      meta: {
        total,
        page: validatedPage,
        limit: validatedLimit,
        hasNextPage: total > validatedPage * validatedLimit,
      },
    });
  }
}
