import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(
    data: Prisma.NotificationCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.notification.create({
      data,
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async updateNotification(id: string, data: Prisma.NotificationUpdateInput) {
    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }
}
