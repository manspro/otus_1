import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: 'Привет, как дела?' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class DialogMessageDto {
  @ApiProperty({ example: 'e4d2e6b0-cde2-42c5-aac3-0b8316f21e58' })
  from: string;

  @ApiProperty({ example: 'f5e3f7c1-8d42-43d6-b4b4-1c9427f32f69' })
  to: string;

  @ApiProperty({ example: 'Привет, как дела?' })
  text: string;
}

export class DialogListDto {
  @ApiProperty({ example: 'f5e3f7c1-8d42-43d6-b4b4-1c9427f32f69' })
  user_id: string;

  @ApiProperty({ example: 'Мария Петрова' })
  user_name: string;

  @ApiProperty({ example: 'Привет, как дела?' })
  last_message: string;

  @ApiProperty({ example: '2023-01-01T12:00:00Z' })
  last_message_time: string;
}
