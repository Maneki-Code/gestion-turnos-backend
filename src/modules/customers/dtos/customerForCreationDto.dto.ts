import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Matches } from "class-validator";

export class CustomerForCreationDto {
  @ApiProperty({
    description: 'First name of the customer',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the customer',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Phone number of the customer in Argentina',
    example: '+541123456789',
  })
  @IsString()
  @Matches(/^(\+54\d{9,10}|\d{10,11})$/, {
    message: 'Invalid Argentine phone number format',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;
}