import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() userData: { username: string; email: string; firstName: string; lastName: string; password: string }
  ) {
    if (!userData.username || !userData.email || !userData.firstName || !userData.lastName || !userData.password) {
      throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
    }
    return this.authService.signup(userData);
  }

  @Post('login')
  async login(@Body() userData: { username: string; password: string }) {
    return this.authService.login(userData);
  }
}
