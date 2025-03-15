import {
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { EDayOfWeek } from '@prisma/client';

export class ScheduleDayForCreationDto {
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each startTime must be in the format HH:mm',
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each endTime must be in the format HH:mm',
  })
  endTime: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each startTime must be in the format HH:mm',
  })
  startRest?: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each endTime must be in the format HH:mm',
  })
  endRest?: string;

  @IsInt()
  @Min(1)
  @Max(1440)
  slotInterval: number;

  @IsEnum(EDayOfWeek)
  day: EDayOfWeek;
}
