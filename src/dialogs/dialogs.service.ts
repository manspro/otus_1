import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DialogMessage } from '../entities/dialog-message.entity';
import { User } from '../entities/user.entity';
import { SendMessageDto, DialogMessageDto } from '../dto/dialog.dto';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(DialogMessage)
    private dialogMessageRepository: Repository<DialogMessage>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendMessage(sendMessageDto: SendMessageDto, fromUserId: string, toUserId: string): Promise<void> {
    // Проверяем, что пользователи существуют
    const fromUser = await this.userRepository.findOne({ where: { id: fromUserId } });
    const toUser = await this.userRepository.findOne({ where: { id: toUserId } });

    if (!fromUser || !toUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    const message = this.dialogMessageRepository.create({
      fromUserId,
      toUserId,
      text: sendMessageDto.text,
    });

    await this.dialogMessageRepository.save(message);
  }

  async getDialogMessages(currentUserId: string, otherUserId: string): Promise<DialogMessageDto[]> {
    // Проверяем, что пользователи существуют
    const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
    const otherUser = await this.userRepository.findOne({ where: { id: otherUserId } });

    if (!currentUser || !otherUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Получаем все сообщения между двумя пользователями
    const messages = await this.dialogMessageRepository
      .createQueryBuilder('message')
      .where(
        '(message.fromUserId = :currentUserId AND message.toUserId = :otherUserId) OR (message.fromUserId = :otherUserId AND message.toUserId = :currentUserId)',
        { currentUserId, otherUserId }
      )
      .orderBy('message.createdAt', 'ASC')
      .getMany();

    return messages.map(message => ({
      from: message.fromUserId,
      to: message.toUserId,
      text: message.text,
    }));
  }
}
