import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { NotificationResponseDto } from './dtos/response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateNotificationDto } from './dtos/create.dto';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface SseResponse extends Response {
  flush?: () => void;
}

@Injectable()
export class NotificationService {
  private readonly clients = new Map<string, Set<SseResponse>>();

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly prisma: PrismaService,
  ) {}

  addClient(userId: string, res: SseResponse): () => void {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(res);

    return () => {
      const userClients = this.clients.get(userId);
      if (userClients) {
        userClients.delete(res);
        if (userClients.size === 0) this.clients.delete(userId);
      }
    };
  }

  async createAndSendNotification(
    userId: string,
    dto: CreateNotificationDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const newNotification =
        await this.notificationRepository.createNotification(
          {
            user: {
              connect: {
                id: userId,
              },
            },
            type: dto.type,
            content: dto.content,
            size: dto.size,
          },
          tx,
        );

      const client = this.clients.get(userId);

      if (client && client.size > 0) {
        const notificationToSend = plainToInstance(
          NotificationResponseDto,
          newNotification,
          { excludeExtraneousValues: true },
        );

        const data = JSON.stringify(notificationToSend);

        client.forEach((client) => {
          client.write(`id: ${newNotification.id}\n`);
          client.write(`event: message\n`);
          client.write(`data: ${data}\n\n`);
          if (typeof client.flush === 'function') {
            client.flush();
          }
        });
        console.log(`Notification sent to user: ${userId}`);
      } else {
        console.log(`[SSE PUSH FAIL] User ${userId} is NOT connected.`);
      }
      return newNotification;
    } catch (error) {
      console.error(
        `[FATAL NOTIF ERROR] DB or Push failed for User ${userId}:`,
        error,
      );
      if (tx) throw error;
      return null;
    }
  }

  async getNotifications(userId: string): Promise<NotificationResponseDto[]> {
    const notificationList =
      await this.notificationRepository.findByUserId(userId);
    return plainToInstance(NotificationResponseDto, notificationList);
  }

  async checkNotification(id: string): Promise<void> {
    await this.notificationRepository.updateNotification(id, {
      isChecked: true,
    });
  }
}
