import { IsEmail, IsString, IsDateString, IsArray, ArrayNotEmpty, IsEnum, IsDate } from 'class-validator';
import { ScheduleDayForCreationDto } from './scheduleDayForCreationDto.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


export class ScheduleForCreationDto {
  @ApiProperty({
    description: `User email who owns the schedule`,
    example: `user@example.com`
  })
  @IsEmail()
  userEmail: string;

  @ApiProperty({
    description: `Schedule's description`,
    example: `Agenda de turnos médicos`
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: `Start date: YYYY-MM-DD`,
    example: `2025-03-01`
  })
  @Type(() => Date)  
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: `End date: YYYY-MM-DD`,
    example: `2025-10-31`
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: 'List of schedule days',
    type: [ScheduleDayForCreationDto]
  })
  @IsArray()
  @ArrayNotEmpty()
  scheduleDays: ScheduleDayForCreationDto[];
}
