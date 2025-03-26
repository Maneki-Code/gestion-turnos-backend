import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { CustomerForCreationDto } from '../dtos/customerForCreationDto.dto';
import { CustomerResponse } from '../dtos/customer.response';
import { CustomerMapperService } from 'src/common/mappers/services/customer-mapper.service';

@Injectable()
export class CustomersService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _customerMapper: CustomerMapperService,
  ) {}

  async create(request: CustomerForCreationDto): Promise<Customer> {
    const customerFound = await this.findByPhoneNumber(request.phoneNumber);

    if (customerFound !== null)
      throw new ConflictException(
        `El número de teléfono ${request.phoneNumber} ya está asociado a un cliente`,
      );

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

  async findAll(): Promise<CustomerResponse[]> {
    const customers = await this._prisma.customer.findMany({});

    return customers.map((customer) =>
      this._customerMapper.customerToFullResponse(customer),
    );
  }

  async searchCustomers(query: string): Promise<CustomerResponse[]> {
    const customers = await this._prisma.customer.findMany({
      where: {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { phoneNumber: { contains: query } },
          { email: { contains: query } },
        ],
      },
    });

    return customers.map((customer) =>
      this._customerMapper.customerToFullResponse(customer),
    );
  }
}
