import {
  IsString,
  IsEmail,
  IsDateString,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsInt,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { EDayOfWeek } from '@prisma/client';

export class ScheduleForCreationDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'startTime must be in the format HH:mm',
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'endTime must be in the format HH:mm',
  })
  endTime: string;

  @IsInt()
  @Min(1)
  @Max(1440)
  slotInterval: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EDayOfWeek, { each: true })
  days: EDayOfWeek[];
}
