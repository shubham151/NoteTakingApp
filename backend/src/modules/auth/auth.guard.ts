import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log("Checking JWT Token in Request Headers:", request.headers.authorization);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.error("Unauthorized - No valid user extracted:", err || info);
      throw err || new UnauthorizedException();
    }
    console.log("Authenticated User:", user);
    return user;
  }
}
