import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { CustomerForCreationDto } from '../dtos/customerForCreationDto.dto';
import { CustomerResponse } from '../dtos/customer.response';
import { CustomerMapperService } from 'src/common/mappers/services/customer-mapper.service';
import { CustomerForUpdateDto } from '../dtos/customerForUpdateDto.dto';

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

  async updateCustomer(request: CustomerForUpdateDto):Promise<void>{
    const customerFound = await this._prisma.customer.findUnique({
      where:{
        id: request.id
      }
    })

    if(!customerFound) throw new NotFoundException(`No se encontró el cliente`);

    if(request.phoneNumber && customerFound.phoneNumber !== request.phoneNumber){
      const availiblePhone= await this._prisma.customer.findUnique({
        where:{
          phoneNumber: request.phoneNumber
        }
      })

      if(availiblePhone) throw new BadRequestException(`El número de teléfono ${request.phoneNumber} ya está en uso.`);
    }

    const updateData: Partial<CustomerForUpdateDto> = {};
    if (request.firstName) updateData.firstName = request.firstName;
    if (request.lastName) updateData.lastName = request.lastName;
    if (request.phoneNumber) updateData.phoneNumber = request.phoneNumber;
    if (request.email) updateData.email = request.email;

    await this._prisma.customer.update({
      where: { id: request.id },
      data: updateData
    });
  }
  
}
