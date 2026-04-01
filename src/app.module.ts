import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SearchModule } from './modules/search/search.module';
import { UsersModule } from './modules/users/users.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { ProgramsModule } from './modules/programs/programs.module';

@Module({
  imports: [AuthModule, SearchModule, UsersModule, UniversitiesModule, ProgramsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
