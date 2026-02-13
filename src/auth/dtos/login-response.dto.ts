import { UserType } from '@prisma/client';

class GradeDto {
  id: string;
  name: string;
  rate: number;
  minAmount: number;
}
class UserProfileDto {
  id: string;
  email: string;
  name: string;
  type: UserType;
  points: number;
  image: string | null;
  grade: GradeDto;
}

export class LoginResponseDto {
  user: UserProfileDto;
  accessToken: string;
}
