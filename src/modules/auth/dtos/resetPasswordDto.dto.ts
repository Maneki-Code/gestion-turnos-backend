import { IsInt, Min, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'ID del usuario que solicita el cambio de contraseña',
    example: 123,
    minimum: 1,
  })
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  @Min(1, { message: 'El ID del usuario debe ser mayor a 0' })
  userId: number;

  @ApiProperty({
    description: 'Nueva contraseña para el usuario',
    example: 'nuevaSegura123',
    minLength: 8,
  })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  newPassword: string;
}
