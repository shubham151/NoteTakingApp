import {
  Controller,
  Post,
  Get,
  Patch,
  UseGuards,
  Request,
  Body,
  Param,
} from '@nestjs/common';
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

  @Patch('update/:noteId')
  async updateNoteContent(
    @Param('noteId') noteId: number,
    @Body() { content, title }: { content: string; title: string },
    @Request() req,
  ) {
    return this.notesService.updateNoteContent(
      noteId,
      content,
      title,
      req.user.username,
    );
  }

  @Patch('share/:noteId')
  async shareNote(
    @Param('noteId') noteId: number,
    @Body() { username }: { username: string },
    @Request() req,
  ) {
    return this.notesService.shareNoteWithUser(
      noteId,
      username,
      req.user.username,
    );
  }
}
