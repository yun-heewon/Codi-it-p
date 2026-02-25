import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOrUpdateInquiryReplyDto {
  @IsNotEmpty()
  @IsString({ message: '답변 내용은 문자열이어야 합니다.' })
  content: string;
}
