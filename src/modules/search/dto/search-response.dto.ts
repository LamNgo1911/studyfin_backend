import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProviderDto {
  @ApiProperty({ description: 'Provider university OID' })
  oid: string;

  @ApiProperty({ description: 'Provider university name' })
  name: string;

  @ApiProperty({ description: 'Provider locations' })
  locations: { code: string; name: string }[];
}

class ProgramHitFieldsDto {
  @ApiPropertyOptional()
  typePath?: string;

  @ApiProperty()
  isDegree: boolean;

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  creditsAmount?: number;

  @ApiPropertyOptional()
  creditsUnit?: string;

  @ApiPropertyOptional()
  eqfLevel?: string;

  @ApiPropertyOptional()
  nqfLevel?: string;

  @ApiPropertyOptional()
  fieldOfStudy?: string;

  @ApiProperty()
  degreeTitles: string[];

  @ApiProperty()
  teachingLanguages: string[];

  @ApiPropertyOptional()
  implementations?: any;

  @ApiProperty({ type: [ProviderDto] })
  providers: ProviderDto[];
}

export class SearchHitDto {
  @ApiProperty({ description: 'Item OID' })
  oid: string;

  @ApiProperty({ description: 'Item name' })
  name: string;

  @ApiPropertyOptional({ description: 'Item description' })
  description?: string;

  @ApiProperty({ description: "'program' or 'institution'" })
  type: 'program' | 'institution';

  // Type-specific fields — only populated when matching the discriminator
  @ApiPropertyOptional({ description: 'Institution logo URL (institution type only)' })
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Institution municipality (institution type only)' })
  municipality?: string;

  @ApiPropertyOptional({ description: 'Institution website (institution type only)' })
  website?: string;

  @ApiPropertyOptional({ description: 'Institution email (institution type only)' })
  email?: string;

  @ApiPropertyOptional({ description: 'Institution student count (institution type only)' })
  studentCount?: number;

  @ApiPropertyOptional({ description: 'Institution locations (institution type only)' })
  locations?: { code: string; name: string }[];

  // Program-specific fields
  @ApiPropertyOptional({ description: 'Program typePath (program type only)' })
  typePath?: string;

  @ApiProperty({ description: 'Item type code' })
  itemType: string;

  @ApiPropertyOptional({ description: 'Whether this item is a degree (program type only)' })
  isDegree?: boolean;

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  creditsAmount?: number;

  @ApiPropertyOptional()
  creditsUnit?: string;

  @ApiPropertyOptional()
  eqfLevel?: string;

  @ApiPropertyOptional()
  nqfLevel?: string;

  @ApiPropertyOptional()
  fieldOfStudy?: string;

  @ApiProperty()
  degreeTitles: string[];

  @ApiProperty()
  teachingLanguages: string[];

  @ApiPropertyOptional()
  implementations?: any;

  @ApiPropertyOptional({ type: [ProviderDto] })
  providers?: ProviderDto[];
}

export class UnifiedSearchResponseDto {
  @ApiProperty({ description: 'Total matching results across both types' })
  total: number;

  @ApiProperty({ description: 'Current page (0-indexed)' })
  page: number;

  @ApiProperty({ description: 'Results per page' })
  size: number;

  @ApiProperty({ type: [SearchHitDto], description: 'Array of program and institution results' })
  hits: SearchHitDto[];
}
