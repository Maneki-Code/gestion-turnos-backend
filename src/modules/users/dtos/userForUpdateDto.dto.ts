import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UserForUpdateDto {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: "User's email address",
    example: 'user@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
