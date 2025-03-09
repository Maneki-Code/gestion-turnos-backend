import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User\'s first name',
    example: 'John',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  firstName: string;

  @ApiProperty({
    description: 'User\'s last name',
    example: 'Doe',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  lastName: string;

  @ApiProperty({
    description: 'User\'s email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User\'s password',
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password: string;
}
