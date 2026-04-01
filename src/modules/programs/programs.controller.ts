import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProgramsService } from './programs.service';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get(':oid')
  findOne(@Param('oid') oid: string, @Query('lng') lng?: string) {
    return this.programsService.findOne(oid, lng);
  }
}
