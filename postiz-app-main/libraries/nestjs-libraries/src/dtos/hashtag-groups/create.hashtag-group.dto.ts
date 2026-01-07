import { IsString, IsOptional, IsDefined, IsArray, MaxLength } from 'class-validator';

export class CreateHashtagGroupDto {
  @IsDefined()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  hashtags: string[];
}

