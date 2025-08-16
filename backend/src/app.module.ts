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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      ssl: { rejectUnauthorized: false },
    }),
    TypeOrmModule.forFeature([User, NoteHeader, NoteDetails]),
    NotesModule,
    AuthModule,
  ],
  providers: [NotesGateway],
})
export class AppModule {}
