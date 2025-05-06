import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class OfferedServiceForUpdateDto {
  @ApiProperty({
    description: 'Customer id',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiPropertyOptional({
    description: 'Title of the offered service',
    example: 'Corte de cabello',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El título es demasiado largo. Máximo 100 caracteres.' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of the offered service',
    example: 'Corte de cabello unisex con lavado',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'La descripción es demasiado larga. Máximo 500 caracteres.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Price of the service in decimal format',
    example: 1500.50,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe tener 2 decimales máximo.' })
  @IsPositive({ message: 'El precio debe ser positivo.' })
  price?: number;
}
