import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotesService } from './notes.service';

@WebSocketGateway({ cors: true })
export class NotesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notesService: NotesService) {}

  @SubscribeMessage('updateNote')
  async handleNoteUpdate(client: any, payload: { noteId: number; content: string }) {
    await this.notesService.updateNoteContent(payload.noteId, payload.content);
    this.server.emit('noteUpdated', payload);
  }
}
