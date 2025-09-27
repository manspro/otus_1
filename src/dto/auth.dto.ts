import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'e4d2e6b0-cde2-42c5-aac3-0b8316f21e58' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Секретная строка' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'Имя' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Фамилия' })
  @IsString()
  @IsNotEmpty()
  second_name: string;

  @ApiProperty({ example: '2017-02-01' })
  @IsDateString()
  birthdate: string;

  @ApiProperty({ example: 'Хобби, интересы и т.п.' })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiProperty({ example: 'Москва' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Секретная строка' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'e4d2e6b0-cde2-42c5-aac3-0b8316f21e58' })
  token: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'e4d2e6b0-cde2-42c5-aac3-0b8316f21e58' })
  user_id: string;
}
