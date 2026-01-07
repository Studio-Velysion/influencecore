import { IsString, IsOptional, IsBoolean, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PostVersionContent } from './create.post.version.dto';

export class UpdatePostVersionDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PostVersionContent)
  content?: PostVersionContent | PostVersionContent[];

  @IsOptional()
  @IsObject()
  options?: Record<string, any>;
}

