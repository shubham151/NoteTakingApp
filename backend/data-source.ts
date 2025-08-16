import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './src/modules/auth/user.entity';
import { NoteHeader } from './src/modules/notes/notes-header.entity';
import { NoteDetails } from './src/modules/notes/notes-details.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost')
    ? false
    : { rejectUnauthorized: false },
  entities: [User, NoteHeader, NoteDetails],
  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/migrations/*.js']
      : ['src/migrations/*.ts'],
  synchronize: false,
});
