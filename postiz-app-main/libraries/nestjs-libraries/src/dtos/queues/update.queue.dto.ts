import { IsString, IsOptional, IsBoolean, IsObject, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QueueSchedule } from './create.queue.dto';

export class UpdateQueueDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => QueueSchedule)
  schedule?: QueueSchedule;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

