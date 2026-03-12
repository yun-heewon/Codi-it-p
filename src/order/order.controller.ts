import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GetUser } from 'src/auth/get-user-decorator';
import { FrontOrderDto } from './dtos/front-response.dto';
import { FrontOrderListResponse } from './dtos/front-order-list-response.dto';
import { FrontOrder } from './dtos/front-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrder(
    @GetUser('id') userId: string,
    @Body() data: CreateOrderDto,
  ): Promise<FrontOrderDto> {
    const created =
      data.orderItems && data.orderItems.length > 0
        ? await this.orderService.createOrder(userId, data)
        : await this.orderService.createOrderFromCart(userId, {
            name: data.name,
            phoneNumber: data.phoneNumber,
            address: data.address,
            usePoint: data.usePoint,
          });
    return new FrontOrderDto(created);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getOrderList(
    @GetUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<FrontOrderListResponse> {
    const result = await this.orderService.getOrderList(userId, page, limit);

    return new FrontOrderListResponse(result);
  }

  @Get(':orderId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getOrderDetail(
    @GetUser('id') userId: string,
    @Param('orderId') orderId: string,
  ): Promise<FrontOrderDto> {
    const result = await this.orderService.getOrderDetail(userId, orderId);

    if (!result) {
      throw new NotFoundException('주문 정보를 찾을 수 없습니다.');
    }
    return new FrontOrderDto(result);
  }

  @Patch(':orderId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateOrder(
    @GetUser('id') userId: string,
    @Param('orderId') orderId: string,
    @Body() data: UpdateOrderDto,
  ): Promise<FrontOrder> {
    const result = await this.orderService.updateOrder(userId, orderId, data);

    return new FrontOrder(result);
  }

  @Delete(':orderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrder(
    @GetUser('id') userId: string,
    @Param('orderId') orderId: string,
  ): Promise<void> {
    await this.orderService.deleteOrder(userId, orderId);
  }
}
