export class LocationDto {
  code: string;
  name: string;
}

export class InstitutionDto {
  oid: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  type: string;
  municipality: string | null;
  website: string | null;
  email: string | null;
  studentCount: number | null;
  locations: LocationDto[];
}

export class InstitutionSearchResponseDto {
  total: number;
  page: number;
  size: number;
  hits: InstitutionDto[];
}
