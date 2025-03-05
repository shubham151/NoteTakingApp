import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, lastValueFrom } from 'rxjs';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'ws') {
      return this.validateWebSocketToken(context);
    }

    const result = super.canActivate(context);
    if (result instanceof Observable) {
      return lastValueFrom(result); 
    }
    return result;
  }

  private validateWebSocketToken(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.auth?.token || client.handshake?.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new WsException('Unauthorized: No token provided');
    }

    try {
      const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      client.user = decoded;
      return true;
    } catch (error) {
      throw new WsException('Unauthorized: Invalid token');
    }
  }
}
