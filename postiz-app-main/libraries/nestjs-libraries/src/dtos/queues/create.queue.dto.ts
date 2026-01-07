import { IsString, IsOptional, IsBoolean, IsDefined, IsObject, MaxLength } from 'class-validator';

export class QueueSchedule {
  @IsDefined()
  @IsString({ each: true })
  times: string[]; // Format: ["09:00", "12:00", "15:00"]

  @IsDefined()
  @IsString({ each: true })
  days: string[]; // Format: ["monday", "tuesday", ...]
}

export class CreateQueueDto {
  @IsDefined()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsDefined()
  @IsObject()
  schedule: QueueSchedule;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

