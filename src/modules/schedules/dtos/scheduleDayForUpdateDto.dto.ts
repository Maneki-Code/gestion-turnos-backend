import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ScheduleDayRestForUpdateDto } from './ScheduleDayRestForUpdateDto.dto';
import { Type } from 'class-transformer';

export class ScheduleDayConfigForUpdateDto {

  @ApiProperty({
    description: 'Schedule day enum',
    example: 'LUNES',
  })
  @IsString()
  day:string;


  @ApiProperty({
    description: 'Schedule day id',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  id: number;
  @ApiProperty({
    description: 'Start time of the schedule (HH:mm format)',
    example: '09:00',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each startTime must be in the format HH:mm',
  })
  startTime?: string;

  @ApiProperty({
    description: 'End time of the schedule (HH:mm format)',
    example: '18:00',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each endTime must be in the format HH:mm',
  })
  endTime?: string;

  @ApiProperty({
    description: 'Time slot interval in minutes',
    example: 30,
    minimum: 1,
    maximum: 1440,
  })
  @IsInt()
  @Min(1)
  @Max(1440)
  slotInterval?: number;

  @ApiProperty({
    description: 'Status of the day',
    example: 'true'
  })
  @IsBoolean()
  status?: boolean;

  @ApiProperty({
    description: 'List of rests',
    type: [ScheduleDayRestForUpdateDto],
  })
  @IsArray()
  @ValidateNested({ each: true }) 
  @Type(() => ScheduleDayRestForUpdateDto) 
  rests: ScheduleDayRestForUpdateDto[];
}
