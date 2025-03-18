import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsString } from 'class-validator';
import { ScheduleDayConfigForUpdateDto } from './scheduleDayForUpdateDto.dto';

export class ScheduleForUpdateDto {
  id: number;
  @ApiProperty({
    description: 'List of schedule days',
    type: [ScheduleDayConfigForUpdateDto],
  })
  @IsArray()
  scheduleDays: ScheduleDayConfigForUpdateDto[];
}
