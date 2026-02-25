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
    Object.assign(this, partial);
  }
}
