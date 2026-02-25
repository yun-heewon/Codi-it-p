import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isSecret: boolean;
}
