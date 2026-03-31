import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { StoreRepository } from './store.repository';
import { CreateStoreDto } from './dtos/create.dto';
import { UpdateStoreDto } from './dtos/update.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createStore(userId: string, data: CreateStoreDto) {
    const trimmedName = data.name.trim();
    const existingStore = await this.storeRepository.findByName(trimmedName);
    if (existingStore) {
      throw new ConflictException('이미 존재하는 스토어 이름입니다.');
    }

    const storeInfo = {
      ...data,
      name: trimmedName,
      user: {
        connect: { id: userId },
      },
    };

    if (!storeInfo.image) {
      storeInfo.image = 'www.sample.png'; // 기본 이미지 설정
    }
    const newStore = await this.storeRepository.createStore(storeInfo);

    return newStore;
  }

  async updateStore(storeId: string, userId: string, data: UpdateStoreDto) {
    const existingStore = await this.storeRepository.findById(storeId);
    if (!existingStore) {
      throw new NotFoundException('존재하지 않는 스토어입니다.');
    }
    if (existingStore.userId !== userId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    const updateData = { ...data };
    if (updateData.name) {
      updateData.name = updateData.name.trim();
    }

    if (updateData.name && updateData.name !== existingStore.name) {
      const nameExists = await this.storeRepository.findByName(updateData.name);
      if (nameExists) {
        throw new ConflictException('이미 존재하는 스토어 이름입니다.');
      }
    }
    const updatedStore = await this.storeRepository.updateStore(
      storeId,
      userId,
      updateData,
    );

    return updatedStore;
  }

  async getStoreById(storeId: string) {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new NotFoundException('존재하지 않는 스토어입니다.');
    }

    return store;
  }

  async getMyStore(userId: string) {
    const mystore = await this.storeRepository.findMyStore(userId);
    if (!mystore) {
      throw new NotFoundException('존재하지 않는 스토어입니다.');
    }

    return mystore;
  }

  async getMyStoreProducts(userId: string, page: number, pageSize: number) {
    const myStore = await this.storeRepository.findMyStore(userId);
    if (!myStore) {
      throw new NotFoundException('존재하지 않는 스토어입니다.');
    }

    const productsWithStock =
      (await this.storeRepository.findMyStoreProducts(
        userId,
        page,
        pageSize,
      )) || [];
    const totalCount = await this.storeRepository.countMyStoreProducts(userId);

    const list = productsWithStock.map((product) => {
      const stock = (product.Stock || []).reduce(
        (sum, current) => sum + current.quantity,
        0,
      );

      const isDiscount =
        (product.discountRate ?? 0) > 0 &&
        product.discountEndTime !== null &&
        product.discountEndTime > new Date();

      const isSoldOut = stock <= 0;

      return {
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.price ? Number(product.price) : 0,
        createdAt: product.createdAt,
        stock,
        isDiscount,
        isSoldOut,
      };
    });

    return {
      list,
      totalCount,
    };
  }

  async registerStoreLike(userId: string, storeId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const currentStore = await tx.store.findUnique({
        where: { id: storeId },
        select: { favoriteCount: true },
      });

      if (!currentStore) {
        throw new NotFoundException('상점을 찾을 수 없습니다.');
      }

      const existingStoreLike = await this.storeRepository.storeLikeCheck(
        userId,
        storeId,
        tx,
      );

      if (!existingStoreLike) {
        await this.storeRepository.createStoreLike(userId, storeId, tx);
        const updatedLikeStore = await this.storeRepository.increaseLikeCount(
          storeId,
          tx,
        );
        return {
          type: 'register',
          store: updatedLikeStore,
        };
      }
    });
  }

  async deleteStoreLike(userId: string, storeId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const currentStore = await tx.store.findUnique({
        where: { id: storeId },
        select: { favoriteCount: true },
      });

      if (!currentStore) {
        throw new NotFoundException('상점을 찾을 수 없습니다.');
      }

      const existingStoreLike = await this.storeRepository.storeLikeCheck(
        userId,
        storeId,
        tx,
      );

      if (existingStoreLike) {
        await this.storeRepository.deleteStoreLike(userId, storeId, tx);

        if (currentStore.favoriteCount > 0) {
          const updatedLikeStore = await this.storeRepository.decreaseLikeCount(
            storeId,
            tx,
          );
          return {
            type: 'delete',
            store: updatedLikeStore,
          };
        }
      }
    });
  }
}
