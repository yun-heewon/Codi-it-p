import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDto) {
    // 이메일 중복 검사
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('이미 존재하는 유저입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 유저 생성
    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      type: data.type,
      grade: { connect: { id: 'grade_green' } },
    });

    return newUser;
  }

  async getUser(userId: string) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    return user;
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    // 유저 조회
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    const { currentPassword, ...updateData } = data;

    // 기존 비밀번호 검증
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('현재 비밀번호가 올바르지 않습니다.');
    }

    // 새 비밀번호 해싱
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userRepository.updateUser(
      userId,
      updateData,
    );

    return updatedUser;
  }

  async getUserLikedStores(userId: string) {
    const likedStores = await this.userRepository.getUserLikedStores(userId);

    if (!likedStores || likedStores.length === 0) {
      return [];
    }

    return likedStores.map((like) => ({
      storeId: like.storeId,
      userId: like.userId,
      store: {
        id: like.store.id,
        name: like.store.name,
        createdAt: like.store.createdAt,
        updatedAt: like.store.updatedAt,
        userId: like.store.userId,
        address: like.store.address,
        detailAddress: like.store.detailAddress,
        phoneNumber: like.store.phoneNumber,
        content: like.store.content,
        image: like.store.image,
      },
    }));
  }

  async deleteUser(userId: string) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    await this.userRepository.deleteUser(userId);

    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}
