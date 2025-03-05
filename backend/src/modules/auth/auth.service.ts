import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async signup(userData: { username: string; email: string; firstName: string; lastName: string; password: string }) {
    const existingUser = await this.userRepository.findOne({ where: [{ username: userData.username }, { email: userData.email }] });

    if (existingUser) {
      throw new HttpException('Username or Email already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.userRepository.create({
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return { message: 'Signup successful', user: { username: newUser.username, email: newUser.email } };
  }

  async login(userData: { username: string; password: string }) {
    console.log('Login attempt for username:', userData.username);

    const user = await this.userRepository.findOne({
      where: [{ username: userData.username }, { email: userData.username }],
    });

    if (!user) {
      console.error('User not found:', userData.username);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordValid) {
      console.error('Invalid password for user:', userData.username);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = this.jwtService.sign({ username: user.username, email: user.email });

    console.log('Login successful for user:', userData.username);
    return { accessToken: token };
  }
}
