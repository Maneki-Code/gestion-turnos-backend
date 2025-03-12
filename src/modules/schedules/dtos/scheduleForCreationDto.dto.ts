import { IsString, IsEmail, IsDateString, IsArray, ArrayNotEmpty, IsEnum, IsInt, Min, Max } from 'class-validator';
import { EDayOfWeek } from '@prisma/client';

export class ScheduleForCreationDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsInt()
  @Min(1)
  @Max(1440)
  slotInterval: number; // Intervalo en minutos, debe estar entre 1 y 1440 (24 horas)

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EDayOfWeek, { each: true })
  days: EDayOfWeek[];
}
