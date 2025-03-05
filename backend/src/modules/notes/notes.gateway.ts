import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotesService } from './notes.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthenticatedSocket } from '../../types/custom-socket.types'; 

@WebSocketGateway({ cors: { origin: '*' } })
export class NotesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notesService: NotesService) {}

  @SubscribeMessage('updateNote')
  @UseGuards(JwtAuthGuard)
  async handleUpdateNote(
    @MessageBody() { noteId, title, content }: { noteId: number; title: string; content: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    const username = client.user?.username;

    if (!username) {
      return { error: 'Unauthorized' };
    }

    try {
      await this.notesService.updateNoteContent(noteId, content, title, username);
      this.server.emit('noteUpdated', { noteId, content });
    } catch (error) {
      console.error('WebSocket Update Error:', error);
    }
  }
}
