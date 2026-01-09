import { IsString, IsOptional, IsObject, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TemplateContent } from './create.template.dto';

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TemplateContent)
  content?: TemplateContent | TemplateContent[];

  @IsOptional()
  @IsString()
  description?: string;
}

