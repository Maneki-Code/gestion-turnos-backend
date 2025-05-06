import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class ScheduleHolidayForCreationDto {
  @ApiProperty({
    description: 'ID of the schedule to apply holidays to',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  scheduleId: number;

  @ApiProperty({
    description: 'Initial date of holidays',
    example: '2025-03-25',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  }) 
  startDate: string;
  
  @ApiProperty({
    description: 'End date of holidays',
    example: '2025-03-25',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  }) 
  endDate: string;

  @ApiProperty({
    description: 'Reason',
    example: 'Feriado',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional() 
  reason?: string;
}
