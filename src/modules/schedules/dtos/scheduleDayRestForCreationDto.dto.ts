import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class ScheduleDayRestForCreationDto{
  @ApiProperty({
    description: 'Start time of the rest period (HH:mm format)',
    example: '12:00',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each startRest must be in the format HH:mm',
  })
  startRest: string;

  @ApiProperty({
    description: 'End time of the rest period (HH:mm format)',
    example: '13:00'
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'Each endRest must be in the format HH:mm',
  })
  endRest: string;
}