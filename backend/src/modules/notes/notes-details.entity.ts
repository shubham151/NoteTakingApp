import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NoteHeader } from './notes-header.entity';

@Entity()
export class NoteDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => NoteHeader, (noteHeader) => noteHeader.details, { onDelete: 'CASCADE' })
  header: NoteHeader;
}
