import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ScheduleDayConfigForUpdateDto } from './scheduleDayForUpdateDto.dto';

export class ScheduleForUpdateDto {
  @ApiProperty({
    description: 'Schedule id',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: 'List of schedule days',
    type: [ScheduleDayConfigForUpdateDto],
  })
  @IsArray() 
  @IsNotEmpty({ message: 'scheduleDays should not be empty' }) 
  @ValidateNested({ each: true }) 
  @Type(() => ScheduleDayConfigForUpdateDto) 
  scheduleDays: ScheduleDayConfigForUpdateDto[];
}
