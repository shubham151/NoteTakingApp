import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteHeader } from './notes-header.entity';
import { NoteDetails } from './notes-details.entity';
import { Raw } from 'typeorm';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(NoteHeader)
    private noteHeaderRepository: Repository<NoteHeader>,

    @InjectRepository(NoteDetails)
    private noteDetailsRepository: Repository<NoteDetails>,
  ) {}

  async createNote(title: string, owner: string) {
    const newNote = this.noteHeaderRepository.create({
      title,
      owner,
      sharedWith: [],
    });
    return this.noteHeaderRepository.save(newNote);
  }

  async addNoteContent(noteId: number, content: string) {
    const noteHeader = await this.noteHeaderRepository.findOne({
      where: { id: noteId },
    });
    if (!noteHeader) throw new NotFoundException('Note not found');

    const noteDetails = this.noteDetailsRepository.create({
      content,
      header: noteHeader,
    });
    return this.noteDetailsRepository.save(noteDetails);
  }

  async getNotesByUser(username: string) {
    return this.noteHeaderRepository.find({
      where: [
        { owner: username },
        { sharedWith: Raw((alias) => `${alias} @> ARRAY[:username]`, { username }) },
      ],
      relations: ['details'],
    });
  }
  

  async updateNoteContent(noteId: number, content: string, title: string, username: string) {
    const note = await this.noteHeaderRepository.findOne({
      where: { id: noteId },
      relations: ['details'],
    });
  
    if (!note) {
      throw new NotFoundException('Note not found');
    }
  
  
    if (note.owner !== username && !note.sharedWith.includes(username)) {
      throw new UnauthorizedException('You do not have permission to edit this note');
    }

    note.title = title;
  

    let noteDetail = await this.noteDetailsRepository.findOne({
      where: { header: { id: noteId } },
    });
  
    if (!noteDetail) {
      noteDetail = this.noteDetailsRepository.create({
        content,
        header: note,
      });
    } else {
      noteDetail.content = content;
    }
  
    await this.noteHeaderRepository.save(note);
    await this.noteDetailsRepository.save(noteDetail);
  
    return { message: 'Note updated successfully' };
  }
  
  

  async shareNoteWithUser(noteId: number, usernameOrEmail: string, owner: string) {
    const note = await this.noteHeaderRepository.findOne({
      where: { id: noteId },
    });
  
    if (!note) {
      throw new NotFoundException('Note not found');
    }
  
    // ✅ Ensure only the owner can share the note
    if (note.owner !== owner) {
      throw new UnauthorizedException('Only the owner can share this note');
    }
  

    const user = await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
   
    const sharedUsers = note.sharedWith || [];
    if (!sharedUsers.includes(user.username)) {
      sharedUsers.push(user.username);
      note.sharedWith = sharedUsers;
      await this.noteHeaderRepository.save(note);
    }
  
    return { message: `Note shared with ${user.username}` };
  }
  
  
}
