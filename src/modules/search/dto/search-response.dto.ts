export class LocationDto {
  code: string;
  name: string;
}

export class ProgramCountDto {
  total: number;
  degreeProgrammes: number;
  nonDegree: number;
}

export class InstitutionDto {
  oid: string;
  name: string;
  description: string;
  logoUrl: string;
  locations: LocationDto[];
  languages: string[];
  programCount: ProgramCountDto;
}

export class SearchResponseDto {
  total: number;
  page: number;
  size: number;
  hits: InstitutionDto[];
}
