import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { UnifiedSearchQueryDto } from './dto/search-query.dto';
import { UnifiedSearchResponseDto } from './dto/search-response.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOkResponse({ type: UnifiedSearchResponseDto })
  search(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: UnifiedSearchQueryDto,
  ) {
    return this.searchService.search(query);
  }
}
