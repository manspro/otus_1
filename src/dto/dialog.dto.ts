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
