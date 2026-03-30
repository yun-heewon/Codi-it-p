import { Expose, Type } from 'class-transformer';
import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { InquiriesResponse } from './inquiries-response.dto';

export class InquiriesListResponse {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InquiriesResponse)
  list: InquiriesResponse[];

  @Expose()
  @IsNumber()
  totalCount: number;

  constructor(partial: Partial<InquiriesListResponse>) {
    this.totalCount = partial.totalCount ?? 0;

    if (partial.list) {
      this.list = partial.list.map((item) => new InquiriesResponse(item));
    } else {
      this.list = [];
    }
  }
}
