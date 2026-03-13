import { BadRequestException } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from 'src/common/constants';
import { Request } from 'express';

// 사용 가능한 파일 타입
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

// 파일 사이즈 제한 (5MB)
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const getMulterS3Config = () => ({
  storage: multerS3({
    s3: s3Client,
    bucket: AWS_BUCKET_NAME,
    contentType: (req, file, cb) => {
      multerS3.AUTO_CONTENT_TYPE(req, file, cb);
    },
    key(
      req: Request,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void,
    ) {
      const ext = path.extname(file.originalname);
      const filename = `${crypto.randomUUID()}${ext}`;
      cb(null, filename);
    },
  }),

  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    // 이미지 형식 제한
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new BadRequestException(
          'PNG, JPEG, JPG 형식의 이미지 파일만 업로드할 수 있습니다.',
        ),
        false,
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },
});
