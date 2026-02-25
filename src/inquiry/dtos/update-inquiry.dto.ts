import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateInquiryDto {
  @IsOptional()
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  title?: string;

  @IsOptional()
  @IsString({ message: '내용은 문자열이어야 합니다.' })
  content?: string;

  @IsOptional()
  @IsBoolean({ message: '비밀글 여부는 true 또는 false 값이어야 합니다.' })
  isSecret?: boolean;
}
