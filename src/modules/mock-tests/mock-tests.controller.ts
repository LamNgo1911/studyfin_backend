import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MockTestsService } from './mock-tests.service';
import { ListTemplatesQueryDto } from './dto/list-templates-query.dto';
import { StartMockTestDto } from './dto/start-mock-test.dto';
import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { MockTestHistoryQueryDto } from './dto/mock-test-history-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../../common/decorators/current-user.decorator';

@Controller('mock-tests')
export class MockTestsController {
  constructor(private readonly mockTestsService: MockTestsService) {}

  @Get('templates')
  listTemplates(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: ListTemplatesQueryDto,
  ) {
    return this.mockTestsService.listTemplates(query);
  }

  @Get('templates/:id')
  getTemplate(@Param('id') id: string) {
    return this.mockTestsService.getTemplate(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  startTest(
    @CurrentUser() user: CurrentUserData,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: StartMockTestDto,
  ) {
    return this.mockTestsService.startTest(user.id, dto);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  getHistory(
    @CurrentUser() user: CurrentUserData,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: MockTestHistoryQueryDto,
  ) {
    return this.mockTestsService.getHistory(user.id, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getAttempt(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.mockTestsService.getAttempt(user.id, id);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  submitAnswers(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: SubmitAnswersDto,
  ) {
    return this.mockTestsService.submitAnswers(user.id, id, dto);
  }
}
