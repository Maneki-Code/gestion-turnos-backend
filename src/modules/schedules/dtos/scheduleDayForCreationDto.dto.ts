import { IsArray, ArrayNotEmpty, IsString, IsEnum, IsInt, Min, Max, Matches } from 'class-validator';
import { EDayOfWeek } from '@prisma/client';

export class ScheduleDayForCreationDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) 
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    each: true,
    message: 'Each startTime must be in the format HH:mm',
  })
  startTimes: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) 
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    each: true, 
    message: 'Each endTime must be in the format HH:mm',
  })
  endTimes: string[];

  @IsInt()
  @Min(1)
  @Max(1440)
  slotInterval: number;

  @IsEnum(EDayOfWeek)
  day: EDayOfWeek;
}
