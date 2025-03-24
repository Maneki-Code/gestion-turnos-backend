import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  IsObject,
} from 'class-validator';
import { CustomerForCreationDto } from 'src/modules/customers/dtos/customerForCreationDto.dto';

export class AppointmentForCreationDto {
  @ApiProperty({
    description: 'Start time of the appointment in ISO 8601 format',
    example: '10:00',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: 'End time of the appointment in ISO 8601 format',
    example: '11:00',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({
    description: 'The date of the appointment',
    example: '2025-03-25',
    type: Date,
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'Description of the appointment',
    example: 'Dentist appointment',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'ID of the schedule to which this appointment belongs',
    example: 1,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  scheduleId: number;

  @ApiProperty({
    description: 'Customer information for this appointment',
    type: CustomerForCreationDto,
  })
  @IsObject()
  @IsNotEmpty()
  customer: CustomerForCreationDto;
}
