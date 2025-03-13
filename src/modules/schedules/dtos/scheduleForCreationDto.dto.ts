import { IsEmail, IsString, IsDateString, IsArray, ArrayNotEmpty, IsEnum } from 'class-validator';
import { ScheduleDayForCreationDto } from './scheduleDayForCreationDto.dto';


export class ScheduleForCreationDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsArray()
  @ArrayNotEmpty()
  scheduleDays: ScheduleDayForCreationDto[];
}
