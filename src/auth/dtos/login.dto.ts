import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: '비밀번호는 최소 2자 이상이어야 합니다.' })
  @MaxLength(50, { message: '비밀번호는 최대 50자 이하여야 합니다.' })
  password!: string;
}
