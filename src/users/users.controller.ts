import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UserDto } from '../dto/user.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get/:id')
  @ApiOperation({ summary: 'Получение анкеты пользователя' })
  @ApiParam({ name: 'id', description: 'Идентификатор пользователя' })
  @ApiResponse({ status: 200, description: 'Успешное получение анкеты пользователя', type: UserDto })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 404, description: 'Анкета не найдена' })
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.getUserById(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Поиск анкет' })
  @ApiQuery({ name: 'first_name', description: 'Часть имени для поиска', example: 'Конст' })
  @ApiQuery({ name: 'last_name', description: 'Часть фамилии для поиска', example: 'Оси' })
  @ApiResponse({ status: 200, description: 'Успешный поиск пользователя', type: [UserDto] })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  async searchUsers(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
  ): Promise<UserDto[]> {
    return this.usersService.searchUsers(firstName, lastName);
  }
}

@ApiTags('Friends')
@Controller('friend')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendsController {
  constructor(private readonly usersService: UsersService) {}

  @Put('set/:user_id')
  @ApiOperation({ summary: 'Добавить в друзья' })
  @ApiParam({ name: 'user_id', description: 'Идентификатор пользователя для добавления в друзья' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно указал своего друга' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async addFriend(
    @Param('user_id') friendId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.usersService.addFriend(user.id, friendId);
  }

  @Put('delete/:user_id')
  @ApiOperation({ summary: 'Удалить из друзей' })
  @ApiParam({ name: 'user_id', description: 'Идентификатор пользователя для удаления из друзей' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удалил из друзей пользователя' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async removeFriend(
    @Param('user_id') friendId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.usersService.removeFriend(user.id, friendId);
  }
}
