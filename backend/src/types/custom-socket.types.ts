import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user?: { username: string; email: string };
}
