import { Expose } from 'class-transformer';

export class GradeResponseDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() rate!: number;
  @Expose() minAmount!: number;
}

export class UserResponseDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() type: any;
  @Expose() points!: number | null;
  @Expose() createdAt!: Date;
  @Expose() updatedAt!: Date;
  @Expose() grade!: any;
  @Expose() image!: string | null;

  constructor(partial: Partial<any>) {
    Object.assign(this, partial);

    const s3BaseUrl = process.env.AWS_S3_BASE_URL;

    if (this.image) {
      if (!this.image.startsWith('http')) {
        const baseUrl = s3BaseUrl!.endsWith('/') ? s3BaseUrl : `${s3BaseUrl}/`;
        this.image = `${baseUrl}${this.image}`;
      }
    } else {
      // 이미지가 없으면 기본 이미지
      this.image = 'https://placehold.co/400.jpg?text=user';
    }
  }
}
