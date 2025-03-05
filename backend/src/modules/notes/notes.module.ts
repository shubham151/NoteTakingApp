import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { NoteHeader } from './notes-header.entity';
import { NoteDetails } from './notes-details.entity';
import { NotesGateway } from './notes.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([NoteHeader, NoteDetails])],
  providers: [NotesService, NotesGateway],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
