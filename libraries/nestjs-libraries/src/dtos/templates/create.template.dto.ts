import { IsString, IsOptional, IsDefined, IsObject, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TemplateContent {
  @IsDefined()
  @IsString()
  body: string;

  @IsOptional()
  @IsString({ each: true })
  media?: string[];
}

export class CreateTemplateDto {
  @IsDefined()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TemplateContent)
  content: TemplateContent | TemplateContent[];

  @IsOptional()
  @IsString()
  description?: string;
}

