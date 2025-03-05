import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from './modules/notes/notes.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/auth/user.entity';
import { NoteHeader } from './modules/notes/notes-header.entity';
import { NoteDetails } from './modules/notes/notes-details.entity';
import { NotesGateway } from './modules/notes/notes.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'notes_db',
      autoLoadEntities: true,
      synchronize: true, // Auto sync tables, disable in production
    }),
    TypeOrmModule.forFeature([User, NoteHeader, NoteDetails]),
    NotesModule,
    AuthModule,
  ],
  providers: [NotesGateway],
})
export class AppModule {}
