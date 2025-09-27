import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  LoginResponseDto,
  RegisterResponseDto,
} from '../dto/auth.dto';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Упрощенный процесс аутентификации' })
  @ApiResponse({
    status: 200,
    description: 'Успешная аутентификация',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('user/register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Успешная регистрация',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
  }
}
