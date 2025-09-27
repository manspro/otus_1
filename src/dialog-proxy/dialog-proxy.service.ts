import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SendMessageDto } from '../dto/dialog.dto';

@Injectable()
export class DialogProxyService {
  private readonly dialogServiceUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.dialogServiceUrl =
      process.env.DIALOG_SERVICE_URL || 'http://localhost:3001';
  }

  async sendMessage(
    sendMessageDto: SendMessageDto,
    fromUserId: string,
    toUserId: string,
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.dialogServiceUrl}/dialog/${toUserId}/send`,
          sendMessageDto,
          {
            headers: {
              'x-user-id': fromUserId,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Dialog service unavailable', 503);
    }
  }

  async getDialogMessages(
    currentUserId: string,
    otherUserId: string,
  ): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.dialogServiceUrl}/dialog/${otherUserId}/list`,
          {
            headers: {
              'x-user-id': currentUserId,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Dialog service unavailable', 503);
    }
  }

  async getUserDialogs(userId: string): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.dialogServiceUrl}/dialog/list`, {
          headers: {
            'x-user-id': userId,
          },
        }),
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Dialog service unavailable', 503);
    }
  }
}
