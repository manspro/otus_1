import { Module } from '@nestjs/common';
import { DialogsController } from './dialogs.controller';
import { DialogProxyModule } from '../dialog-proxy/dialog-proxy.module';

@Module({
  imports: [DialogProxyModule],
  controllers: [DialogsController],
})
export class DialogsModule {}
