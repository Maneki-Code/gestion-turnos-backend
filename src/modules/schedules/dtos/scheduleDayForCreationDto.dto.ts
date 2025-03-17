import {
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EDayOfWeek } from '@prisma/client';

export class ScheduleDayForCreationDto {
  @ApiProperty({
    description: 'Start time of the schedule (HH:mm format)',
    example: '09:00'
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each startTime must be in the format HH:mm',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time of the schedule (HH:mm format)',
    example: '18:00'
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each endTime must be in the format HH:mm',
  })
  endTime: string;

  @ApiProperty({
    description: 'Start time of the rest period (HH:mm format)',
    example: '12:00',
    required: false
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each startRest must be in the format HH:mm',
  })
  startRest?: string;

  @ApiProperty({
    description: 'End time of the rest period (HH:mm format)',
    example: '13:00',
    required: false
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each endRest must be in the format HH:mm',
  })
  endRest?: string;

  @ApiProperty({
    description: 'Time slot interval in minutes',
    example: 30,
    minimum: 1,
    maximum: 1440
  })
  @IsInt()
  @Min(1)
  @Max(1440)
  slotInterval: number;

  @ApiProperty({
    description: 'Day of the week',
    example: 'MONDAY',
    enum: EDayOfWeek
  })
  @IsEnum(EDayOfWeek)
  day: EDayOfWeek;
}
