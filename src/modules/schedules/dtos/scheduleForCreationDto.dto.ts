import { IsEmail, IsString, IsDateString, IsArray, ArrayNotEmpty, IsEnum, IsDate } from 'class-validator';
import { ScheduleDayForCreationDto } from './scheduleDayForCreationDto.dto';
import { Type } from 'class-transformer';


export class ScheduleForCreationDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  description: string;

  @Type(() => Date)  
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsArray()
  @ArrayNotEmpty()
  scheduleDays: ScheduleDayForCreationDto[];
}
