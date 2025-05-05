import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

export class OfferedServiceForCreationDto {
  @ApiProperty({
    description: 'Title of the offered service',
    example: 'Corte de cabello',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El título de demasiado largo. Máximo 100 caracteres.' })
  title: string;

  @ApiProperty({
    description: 'Description of the offered service',
    example: 'Corte de cabello unisex con lavado',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'La descripción es demasiado larga. Máximo 500 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'Price of the service in decimal format',
    example: 1500.50,
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe tener 2 decimales máximo.' })
  @IsPositive({ message: 'El precio debe ser positivo.' })
  price: number;
}
