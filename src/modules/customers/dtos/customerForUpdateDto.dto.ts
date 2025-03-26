import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString } from 'class-validator';
export class CustomerForUpdateDto {
  @ApiProperty({
    description: 'Customer id',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  id:number;
  
  @ApiProperty({
    description: 'First name of the customer',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the customer',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+54226567890',
  })
  @IsPhoneNumber('AR', { message: 'Invalid phone number format' })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;
}
