import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DialogsService } from './dialogs.service';
import { SendMessageDto, DialogMessageDto } from '../dto/dialog.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('Dialogs')
@Controller('dialog')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DialogsController {
  constructor(private readonly dialogsService: DialogsService) {}

  @Post(':user_id/send')
  @ApiOperation({ summary: 'Отправить сообщение пользователю' })
  @ApiParam({
    name: 'user_id',
    description: 'Идентификатор получателя сообщения',
  })
  @ApiResponse({ status: 200, description: 'Успешно отправлено сообщение' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async sendMessage(
    @Param('user_id') toUserId: string,
    @Body() sendMessageDto: SendMessageDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.dialogsService.sendMessage(sendMessageDto, user.id, toUserId);
  }

  @Get(':user_id/list')
  @ApiOperation({ summary: 'Получить диалог между двумя пользователями' })
  @ApiParam({ name: 'user_id', description: 'Идентификатор собеседника' })
  @ApiResponse({
    status: 200,
    description: 'Диалог между двумя пользователями',
    type: [DialogMessageDto],
  })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async getDialogMessages(
    @Param('user_id') otherUserId: string,
    @GetUser() user: User,
  ): Promise<DialogMessageDto[]> {
    return this.dialogsService.getDialogMessages(user.id, otherUserId);
  }
}
