import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import KeyvRedis from '@keyv/redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SearchModule } from './modules/search/search.module';
import { UsersModule } from './modules/users/users.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { MockTestsModule } from './modules/mock-tests/mock-tests.module';
import { PrismaModule } from './providers/prisma.module';
import { SyncModule } from './modules/sync/sync.module';
import { GuidanceModule } from './modules/guidance/guidance.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
        name: 'default',
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        stores: [
          new KeyvRedis(
            configService.get('REDIS_URL', 'redis://localhost:6379'),
          ),
        ],
        ttl: 24 * 60 * 60 * 1000, // 24h default
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    SyncModule,
    AuthModule,
    SearchModule,
    UsersModule,
    UniversitiesModule,
    ProgramsModule,
    GuidanceModule,
    MockTestsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
