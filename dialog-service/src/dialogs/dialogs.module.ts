import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { DialogMessage } from '../entities/dialog-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DialogMessage])],
  controllers: [DialogsController],
  providers: [DialogsService],
  exports: [DialogsService],
})
export class DialogsModule {}
