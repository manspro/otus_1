import { IsString, IsNotEmpty, IsUUID, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class UpdatePostDto {
  @ApiProperty({ example: '1d535fd6-7521-4cb1-aa6d-031be7123c4d' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class PostDto {
  @ApiProperty({ example: '1d535fd6-7521-4cb1-aa6d-031be7123c4d' })
  id: string;

  @ApiProperty({ example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' })
  text: string;

  @ApiProperty({ example: 'e4d2e6b0-cde2-42c5-aac3-0b8316f21e58' })
  author_user_id: string;
}

export class PostIdDto {
  @ApiProperty({ example: '1d535fd6-7521-4cb1-aa6d-031be7123c4d' })
  id: string;
}

export class FeedQueryDto {
  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
