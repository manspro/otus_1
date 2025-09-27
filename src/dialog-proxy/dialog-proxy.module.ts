import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DialogProxyService } from './dialog-proxy.service';

@Module({
  imports: [HttpModule],
  providers: [DialogProxyService],
  exports: [DialogProxyService],
})
export class DialogProxyModule {}
