import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { DialogsService } from './dialogs.service';
import {
  SendMessageDto,
  DialogMessageDto,
  DialogListDto,
} from '../dto/dialog.dto';

@ApiTags('Dialogs')
@Controller('dialog')
export class DialogsController {
  constructor(private readonly dialogsService: DialogsService) {}

  @Post(':user_id/send')
  @ApiOperation({ summary: 'Отправить сообщение пользователю' })
  @ApiParam({
    name: 'user_id',
    description: 'Идентификатор получателя сообщения',
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'Идентификатор отправителя (из монолита)',
  })
  @ApiResponse({ status: 200, description: 'Успешно отправлено сообщение' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async sendMessage(
    @Param('user_id') toUserId: string,
    @Body() sendMessageDto: SendMessageDto,
    @Headers('x-user-id') fromUserId: string,
  ): Promise<void> {
    if (!fromUserId) {
      throw new UnauthorizedException('Missing user ID in headers');
    }

    return this.dialogsService.sendMessage(
      sendMessageDto,
      fromUserId,
      toUserId,
    );
  }

  @Get(':user_id/list')
  @ApiOperation({ summary: 'Получить диалог между двумя пользователями' })
  @ApiParam({ name: 'user_id', description: 'Идентификатор собеседника' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'Идентификатор текущего пользователя (из монолита)',
  })
  @ApiResponse({
    status: 200,
    description: 'Диалог между двумя пользователями',
    type: [DialogMessageDto],
  })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async getDialogMessages(
    @Param('user_id') otherUserId: string,
    @Headers('x-user-id') currentUserId: string,
  ): Promise<DialogMessageDto[]> {
    if (!currentUserId) {
      throw new UnauthorizedException('Missing user ID in headers');
    }

    return this.dialogsService.getDialogMessages(currentUserId, otherUserId);
  }

  @Get('list')
  @ApiOperation({ summary: 'Получить список всех диалогов пользователя' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'Идентификатор пользователя (из монолита)',
  })
  @ApiResponse({
    status: 200,
    description: 'Список диалогов пользователя',
    type: [DialogListDto],
  })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async getUserDialogs(
    @Headers('x-user-id') userId: string,
  ): Promise<DialogListDto[]> {
    if (!userId) {
      throw new UnauthorizedException('Missing user ID in headers');
    }

    return this.dialogsService.getUserDialogs(userId);
  }
}
