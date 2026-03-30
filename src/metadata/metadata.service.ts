import { Injectable } from '@nestjs/common';
import { MetadataRepository } from './metadata.repository';
import { Category } from '@prisma/client';

export interface SizeResponse {
  id: number;
  name: string;
  size: {
    en: string;
    ko: string;
  };
}

export interface GradeResponse {
  id: string;
  name: string;
  rate: number;
  minAmount: number;
}

@Injectable()
export class MetadataService {
  constructor(private readonly metadataRepository: MetadataRepository) {}

  async getSizes(): Promise<SizeResponse[]> {
    const sizes = await this.metadataRepository.getSizes();

    return sizes.map((size) => ({
      id: size.id,
      name: size.name,
      size: {
        en: size.en,
        ko: size.ko,
      },
    }));
  }

  async getGrades(): Promise<GradeResponse[]> {
    const grades = await this.metadataRepository.getGrades();

    return grades.map((grade) => ({
      id: grade.id,
      name: grade.name,
      rate: grade.rate,
      minAmount: grade.minAmount,
    }));
  }

  async getCategories(name: string): Promise<Category[]> {
    return this.metadataRepository.getCategory(name);
  }
}
