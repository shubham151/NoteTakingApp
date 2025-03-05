import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { NotesGateway } from './notes.gateway';
import { NoteHeader } from './notes-header.entity';
import { NoteDetails } from './notes-details.entity';
import { User } from '../auth/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteHeader, NoteDetails, User]),
    AuthModule,
  ],
  providers: [NotesService, NotesGateway],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
