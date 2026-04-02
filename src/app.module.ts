import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SearchModule } from './modules/search/search.module';
import { UsersModule } from './modules/users/users.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { PrismaModule } from './providers/prisma.module';
import { SyncModule } from './modules/sync/sync.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    SyncModule,
    AuthModule,
    SearchModule,
    UsersModule,
    UniversitiesModule,
    ProgramsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
