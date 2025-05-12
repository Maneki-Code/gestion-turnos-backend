import { IsArray, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";  
import { IsNumber } from "class-validator";

export class UserOfferedServicesDto {
  @ApiProperty({
    description: 'El ID del usuario al que se le asignarán los servicios ofrecidos',
    example: 1,
    type: Number,
    required: true,
  })
  @IsNotEmpty() 
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Los IDs de los servicios ofrecidos que se asignarán al usuario',
    example: [1, 2, 3],
    type: [Number],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  offeredServicesIds: number[];
}

