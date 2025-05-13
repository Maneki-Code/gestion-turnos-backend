import { IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class GeneralSettingsForUpdateDto {
  @ApiProperty({
    description: 'Limite de días para reservar',
    example: 30,
    required: false,
  })
  @IsInt()
  @IsNotEmpty()
  limitDaysToReserve?: number;
  @ApiProperty({
    description: 'Mínimo de horas de anticipación',
    example: 24,
    required: false,
  })
  @IsInt()
  @IsNotEmpty()
  minAdvanceHours?: number;
}

	