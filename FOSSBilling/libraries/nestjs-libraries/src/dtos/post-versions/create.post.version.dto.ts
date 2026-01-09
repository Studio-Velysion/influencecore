import { IsString, IsOptional, IsBoolean, IsObject, IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PostVersionContent {
  @IsDefined()
  @IsString()
  body: string;

  @IsOptional()
  @IsString({ each: true })
  media?: string[];
}

export class CreatePostVersionDto {
  @IsDefined()
  @IsString()
  postId: string;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsOptional()
  @IsBoolean()
  isOriginal?: boolean;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => PostVersionContent)
  content: PostVersionContent | PostVersionContent[];

  @IsOptional()
  @IsObject()
  options?: Record<string, any>;
}

