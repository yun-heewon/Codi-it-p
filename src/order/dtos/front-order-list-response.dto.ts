import { Type } from 'class-transformer';
import { FrontOrder } from './front-order.dto';
import { FrontOrderDto } from './front-response.dto';

export class FrontOrderListResponse {
  @Type(() => FrontOrderDto)
  data: FrontOrder[];

  meta!: { total: number; page: number; limit: number; totalPages: number };

  constructor(partial: Partial<FrontOrderListResponse>) {
    Object.assign(this, partial);

    if (partial.data) {
      this.data = partial.data.map((order) => new FrontOrderDto(order));
    }
  }
}
