import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: "User's current password",
    example: 'OldPassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  oldPassword: string;

  @ApiProperty({
    description: "User's new password",
    example: 'NewPassword456',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  newPassword: string;
}
