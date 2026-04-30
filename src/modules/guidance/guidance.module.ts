import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GuidanceController } from './guidance.controller';
import { GuidanceService } from './guidance.service';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [],
  controllers: [GuidanceController],
  providers: [GuidanceService, RolesGuard, Reflector],
  exports: [GuidanceService],
})
export class GuidanceModule {}
