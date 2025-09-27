import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { DialogsModule } from './dialogs/dialogs.module';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { DialogMessage } from './entities/dialog-message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Post, DialogMessage],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    DialogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
