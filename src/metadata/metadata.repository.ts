import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category, Grade, Size } from '@prisma/client';

@Injectable()
export class MetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSizes(): Promise<Size[]> {
    return this.prisma.size.findMany({
      select: {
        id: true,
        name: true,
        ko: true,
        en: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async getGrades(): Promise<Grade[]> {
    return this.prisma.grade.findMany({
      select: {
        name: true,
        id: true,
        rate: true,
        minAmount: true,
      },
      orderBy: { id: 'asc' },
    });
  }
  async getCategory(name: string): Promise<Category[]> {
    if (!name || typeof name !== 'string') {
      return [];
    }
    const whereCondition = {
      name: { contains: name.toUpperCase(), mode: 'insensitive' as const },
    };
    return this.prisma.category.findMany({
      select: {
        name: true,
        id: true,
      },
      where: whereCondition,
      orderBy: { id: 'asc' },
    });
  }
}
