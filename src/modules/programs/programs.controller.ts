import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProgramsService } from './programs.service';

@ApiTags('Programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.programsService.findAll(query);
  }

  @Get(':oid')
  findOne(@Param('oid') oid: string) {
    return this.programsService.findOne(oid);
  }
}
