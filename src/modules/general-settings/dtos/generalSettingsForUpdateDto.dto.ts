import { IsInt, IsNotEmpty, IsOptional, IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class GeneralSettingsForUpdateDto {
  @ApiProperty({
    description: 'Limite de días para reservar',
    example: 30,
    required: false,
  })
  @IsInt()
  @IsOptional()
  limitDaysToReserve?: number;
  @ApiProperty({
    description: 'Dirección de la empresa',
    example: 'Calle 123, Ciudad, País',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;
  @ApiProperty({
    description: 'Número de teléfono de la empresa',
    example: '+54 9 11 3333-3333',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
  @ApiProperty({
    description: 'Correo electrónico de la empresa',
    example: 'info@empresa.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
