import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { NoteDetails } from './notes-details.entity';

@Entity()
export class NoteHeader {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  owner: string;

  @Column('text', { array: true, default: [] }) 
  sharedWith: string[];

  @OneToMany(() => NoteDetails, (noteDetails) => noteDetails.header)
  details: NoteDetails[];
}
