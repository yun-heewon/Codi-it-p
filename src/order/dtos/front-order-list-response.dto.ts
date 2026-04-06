import { Expose, Type } from 'class-transformer';
import { FrontOrder } from './front-order.dto';
import { FrontOrderDto } from './front-response.dto';

export class FrontOrderListResponse {
  @Expose()
  @Type(() => FrontOrderDto)
  data!: FrontOrder[];

  @Expose()
  meta!: { total: number; page: number; limit: number; totalPages: number };

  constructor(partial: Partial<FrontOrderListResponse>) {
    Object.assign(this, partial);

    if (partial.data) {
      this.data = partial.data.map((order) => new FrontOrderDto(order));
    }
  }
}
