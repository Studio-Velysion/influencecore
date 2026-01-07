import { IsString, IsOptional, IsDefined, IsBoolean, IsEnum, MaxLength } from 'class-validator';

export enum VariableType {
  SYSTEM = 'SYSTEM',
  CUSTOM = 'CUSTOM',
  DATE = 'DATE',
  TIME = 'TIME',
  USERNAME = 'USERNAME',
  HASHTAG = 'HASHTAG',
}

export class CreateDynamicVariableDto {
  @IsDefined()
  @IsString()
  @MaxLength(100)
  name: string; // Ex: "{username}", "{date}", "{promo_code}"

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsOptional()
  @IsString()
  value?: string; // Valeur par défaut pour les variables personnalisées

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @IsDefined()
  @IsEnum(VariableType)
  type: VariableType;
}

