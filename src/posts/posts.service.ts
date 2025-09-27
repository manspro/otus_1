import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { CreatePostDto, UpdatePostDto, PostDto } from '../dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createPost(createPostDto: CreatePostDto, userId: string): Promise<{ id: string }> {
    const post = this.postRepository.create({
      text: createPostDto.text,
      authorUserId: userId,
    });

    const savedPost = await this.postRepository.save(post);
    return { id: savedPost.id };
  }

  async updatePost(updatePostDto: UpdatePostDto, userId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: updatePostDto.id }
    });

    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    if (post.authorUserId !== userId) {
      throw new ForbiddenException('Нет прав для редактирования этого поста');
    }

    await this.postRepository.update(updatePostDto.id, {
      text: updatePostDto.text,
    });
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId }
    });

    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    if (post.authorUserId !== userId) {
      throw new ForbiddenException('Нет прав для удаления этого поста');
    }

    await this.postRepository.delete(postId);
  }

  async getPost(postId: string): Promise<PostDto> {
    const post = await this.postRepository.findOne({
      where: { id: postId }
    });

    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    return {
      id: post.id,
      text: post.text,
      author_user_id: post.authorUserId,
    };
  }

  async getFeed(userId: string, offset: number = 0, limit: number = 10): Promise<PostDto[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends']
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const friendIds = user.friends.map(friend => friend.id);
    
    if (friendIds.length === 0) {
      return [];
    }

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .where('post.authorUserId IN (:...friendIds)', { friendIds })
      .orderBy('post.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return posts.map(post => ({
      id: post.id,
      text: post.text,
      author_user_id: post.authorUserId,
    }));
  }
}
