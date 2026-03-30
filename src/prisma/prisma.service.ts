import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false } // 운영 환경용
          : { rejectUnauthorized: false }, // 테스트를 위해 우선 false로 설정
      connectionTimeoutMillis: 30000,
    });
    const adapter = new PrismaPg(pool);

    // Prisma 7에서는 직접 URL 대신 adapter를 전달하는 것을 권장합니다.
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
