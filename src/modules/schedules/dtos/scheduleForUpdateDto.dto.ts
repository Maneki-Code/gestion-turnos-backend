import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsString } from 'class-validator';
import { ScheduleDayForUpdateDto } from './scheduleDayForUpdateDto.dto';

export class ScheduleForUpdateDto {
  id: number;
  @ApiProperty({
    description: `Schedule's description`,
    example: `Agenda de turnos médicos`,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: `Start date: YYYY-MM-DD`,
    example: `2025-03-01`,
  })
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({
    description: `End date: YYYY-MM-DD`,
    example: `2025-10-31`,
  })
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({
    description: 'List of schedule days',
    type: [ScheduleDayForUpdateDto],
  })
  @IsArray()
  scheduleDays: ScheduleDayForUpdateDto[];
}
