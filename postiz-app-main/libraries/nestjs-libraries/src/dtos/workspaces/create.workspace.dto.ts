import { IsString, IsOptional, IsDefined, MaxLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsDefined()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

