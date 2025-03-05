import { Controller, Post, Get, UseGuards, Request, Body } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('create')
  async createNote(@Request() req, @Body() { title }: { title: string }) {
    return this.notesService.createNote(title, req.user.username);
  }

  @Get()
  async getNotes(@Request() req) {
    return this.notesService.getNotesByUser(req.user.username);
  }



//   @Post('content/:noteId')
//   @UseGuards(AuthGuard('jwt'))
//   async addNoteContent(@Param('noteId') noteId: number, @Body() { content }: { content: string }) {
//     return this.notesService.addNoteContent(noteId, content);
//   }

//   @Patch('update/:noteId')
//   @UseGuards(AuthGuard('jwt'))
//   async updateNoteContent(@Param('noteId') noteId: number, @Body() { content }: { content: string }) {
//     return this.notesService.updateNoteContent(noteId, content);
//   }

//   @Post('share/:noteId')
//   @UseGuards(AuthGuard('jwt'))
//   async shareNote(@Param('noteId') noteId: number, @Body() { username }: { username: string }) {
//     return this.notesService.shareNoteWithUser(noteId, username);
//   }
}
