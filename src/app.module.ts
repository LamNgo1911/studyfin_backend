import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SearchModule } from './modules/search/search.module';
import { UsersModule } from './modules/users/users.module';
import { UniversitiesModule } from './modules/universities/universities.module';

@Module({
  imports: [AuthModule, SearchModule, UsersModule, UniversitiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
