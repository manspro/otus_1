import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DialogsModule } from './dialogs/dialogs.module';
import { DialogMessage } from './entities/dialog-message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:', // Используем базу данных в памяти для простоты
      entities: [DialogMessage],
      synchronize: true,
      logging: false,
    }),
    DialogsModule,
  ],
})
export class AppModule {}
