import { Controller, Post, Put, Get, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, PostDto, PostIdDto, FeedQueryDto } from '../dto/post.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('Posts')
@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать пост' })
  @ApiResponse({ status: 200, description: 'Успешно создан пост', type: PostIdDto })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostIdDto> {
    return this.postsService.createPost(createPostDto, user.id);
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить пост' })
  @ApiResponse({ status: 200, description: 'Успешно изменен пост' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.postsService.updatePost(updatePostDto, user.id);
  }

  @Put('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить пост' })
  @ApiParam({ name: 'id', description: 'Идентификатор поста' })
  @ApiResponse({ status: 200, description: 'Успешно удален пост' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async deletePost(
    @Param('id') postId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.postsService.deletePost(postId, user.id);
  }

  @Get('get/:id')
  @ApiOperation({ summary: 'Получить пост' })
  @ApiParam({ name: 'id', description: 'Идентификатор поста' })
  @ApiResponse({ status: 200, description: 'Успешно получен пост', type: PostDto })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 404, description: 'Пост не найден' })
  async getPost(@Param('id') postId: string): Promise<PostDto> {
    return this.postsService.getPost(postId);
  }

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить ленту постов друзей' })
  @ApiQuery({ name: 'offset', required: false, description: 'Оффсет с которого начинать выдачу', example: 0 })
  @ApiQuery({ name: 'limit', required: false, description: 'Лимит, ограничивающий кол-во возвращенных сущностей', example: 10 })
  @ApiResponse({ status: 200, description: 'Успешно получены посты друзей', type: [PostDto] })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async getFeed(
    @Query() query: FeedQueryDto,
    @GetUser() user: User,
  ): Promise<PostDto[]> {
    return this.postsService.getFeed(user.id, query.offset, query.limit);
  }
}
