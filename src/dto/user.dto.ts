import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'e4d2e6b0-cde2-42c5-aac3-0b8316f21e58' })
  id: string;

  @ApiProperty({ example: 'Имя' })
  first_name: string;

  @ApiProperty({ example: 'Фамилия' })
  second_name: string;

  @ApiProperty({ example: '2017-02-01' })
  birthdate: string;

  @ApiProperty({ example: 'Хобби, интересы и т.п.' })
  biography: string;

  @ApiProperty({ example: 'Москва' })
  city: string;
}

export class UserSearchDto {
  @ApiProperty({ example: 'Конст' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Оси' })
  @IsString()
  @IsNotEmpty()
  last_name: string;
}
