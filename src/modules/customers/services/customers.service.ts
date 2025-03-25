import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { CustomerForCreationDto } from '../dtos/customerForCreationDto.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly _prisma: PrismaService) {}

  async create(request: CustomerForCreationDto): Promise<Customer> {
    const customerFound = await this.findByPhoneNumber(request.phoneNumber);
    
    if (customerFound !== null)
      throw new ConflictException(`El número de teléfono ${request.phoneNumber} ya está asociado a un cliente`,);
    
    const customerCreated = await this._prisma.customer.create({
      data: {
        firstName: request.firstName,
        lastName: request.lastName,
        phoneNumber: request.phoneNumber,
        email: request.email ?? null,
      },
    });

    if (!customerCreated)
      throw new BadRequestException(`Algo salió mal al registrar el cliente.`);
    return customerCreated;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Customer | null> {
    return await this._prisma.customer.findUnique({
      where: {
        phoneNumber: phoneNumber,
      },
    });
  }

}
