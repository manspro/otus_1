import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { DialogMessage } from '../entities/dialog-message.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DialogMessage, User])],
  controllers: [DialogsController],
  providers: [DialogsService],
  exports: [DialogsService],
})
export class DialogsModule {}
