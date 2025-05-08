import { IsInt, Min, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  @Min(1, { message: 'El ID del usuario debe ser mayor a 0' })
  userId: number;

  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  newPassword: string;
}
