import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DialogMessage } from '../entities/dialog-message.entity';
import {
  SendMessageDto,
  DialogMessageDto,
  DialogListDto,
} from '../dto/dialog.dto';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(DialogMessage)
    private dialogMessageRepository: Repository<DialogMessage>,
  ) {}

  async sendMessage(
    sendMessageDto: SendMessageDto,
    fromUserId: string,
    toUserId: string,
  ): Promise<void> {
    const message = this.dialogMessageRepository.create({
      fromUserId,
      toUserId,
      text: sendMessageDto.text,
    });

    await this.dialogMessageRepository.save(message);
  }

  async getDialogMessages(
    currentUserId: string,
    otherUserId: string,
  ): Promise<DialogMessageDto[]> {
    // Получаем все сообщения между двумя пользователями
    const messages = await this.dialogMessageRepository
      .createQueryBuilder('message')
      .where(
        '(message.fromUserId = :currentUserId AND message.toUserId = :otherUserId) OR (message.fromUserId = :otherUserId AND message.toUserId = :currentUserId)',
        { currentUserId, otherUserId },
      )
      .orderBy('message.createdAt', 'ASC')
      .getMany();

    return messages.map((message) => ({
      from: message.fromUserId,
      to: message.toUserId,
      text: message.text,
    }));
  }

  async getUserDialogs(userId: string): Promise<DialogListDto[]> {
    // Получаем список всех диалогов пользователя с последними сообщениями
    const dialogs = await this.dialogMessageRepository
      .createQueryBuilder('message')
      .select([
        'CASE WHEN message.fromUserId = :userId THEN message.toUserId ELSE message.fromUserId END as user_id',
        'message.text as last_message',
        'message.createdAt as last_message_time',
      ])
      .where('message.fromUserId = :userId OR message.toUserId = :userId', {
        userId,
      })
      .orderBy('message.createdAt', 'DESC')
      .getRawMany();

    // Группируем по пользователям и берем последнее сообщение
    const uniqueDialogs = new Map();
    dialogs.forEach((dialog) => {
      if (!uniqueDialogs.has(dialog.user_id)) {
        uniqueDialogs.set(dialog.user_id, {
          user_id: dialog.user_id,
          user_name: `User ${dialog.user_id.substring(0, 8)}`, // Упрощенное имя
          last_message: dialog.last_message,
          last_message_time: dialog.last_message_time,
        });
      }
    });

    return Array.from(uniqueDialogs.values());
  }
}
