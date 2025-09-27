import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user_id: string }> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      firstName: registerDto.first_name,
      secondName: registerDto.second_name,
      birthdate: new Date(registerDto.birthdate),
      biography: registerDto.biography || '',
      city: registerDto.city,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.userRepository.save(user);
      return { user_id: savedUser.id };
    } catch (error) {
      throw new BadRequestException('Невалидные данные');
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      where: { id: loginDto.id },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Невалидные данные');
    }

    const payload = { sub: user.id, userId: user.id };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Неавторизованный доступ');
    }

    return user;
  }
}
