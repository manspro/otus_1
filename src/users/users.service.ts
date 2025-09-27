import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'firstName', 'secondName', 'birthdate', 'biography', 'city']
    });

    if (!user) {
      throw new NotFoundException('Анкета не найдена');
    }

    return {
      id: user.id,
      first_name: user.firstName,
      second_name: user.secondName,
      birthdate: user.birthdate.toISOString().split('T')[0],
      biography: user.biography,
      city: user.city,
    };
  }

  async searchUsers(firstName: string, lastName: string): Promise<UserDto[]> {
    const users = await this.userRepository.find({
      where: {
        firstName: Like(`%${firstName}%`),
        secondName: Like(`%${lastName}%`),
      },
      select: ['id', 'firstName', 'secondName', 'birthdate', 'biography', 'city']
    });

    return users.map(user => ({
      id: user.id,
      first_name: user.firstName,
      second_name: user.secondName,
      birthdate: user.birthdate.toISOString().split('T')[0],
      biography: user.biography,
      city: user.city,
    }));
  }

  async addFriend(userId: string, friendId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends']
    });

    const friend = await this.userRepository.findOne({
      where: { id: friendId }
    });

    if (!user || !friend) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (!user.friends.some(f => f.id === friendId)) {
      user.friends.push(friend);
      await this.userRepository.save(user);
    }
  }

  async removeFriend(userId: string, friendId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends']
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    user.friends = user.friends.filter(friend => friend.id !== friendId);
    await this.userRepository.save(user);
  }
}
