import { BadRequestException, Injectable } from '@nestjs/common';
import { OfferedServiceForCreationDto } from '../dtos/offeredServiceForCreationDto.dto';
import { OfferedServiceResponse } from '../dtos/offeredService.response';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { OfferedService, Prisma } from '@prisma/client';
import { of } from 'rxjs';
import { OfferedServiceForUpdateDto } from '../dtos/offeredServiceForUpdateDto.dto';

@Injectable()
export class OfferedServicesService {
  
  constructor(private readonly _prisma:PrismaService){}

  async create(request: OfferedServiceForCreationDto): Promise<OfferedServiceResponse> {
    const foundService = await this._prisma.offeredService.findUnique({where: {title: request.title}});

    if(foundService !== null) throw new BadRequestException(`Ya existe un servicio con el nombre ${request.title}`);

    const createdService = await this._prisma.offeredService.create({
      data: {
        title: request.title,
        description: request.description ?? null,
        price: new Prisma.Decimal(request.price),
      },
    });

    if(!createdService) throw new BadRequestException(`No se pudo crear el servicio.`);

    return this.offeredServiceToResponse(createdService);
  }

  async findAll(): Promise<OfferedServiceResponse[]> {
    const services = await this._prisma.offeredService.findMany();

    return services.map(offeredService => this.offeredServiceToResponse(offeredService));
  }

  async update(request: OfferedServiceForUpdateDto): Promise<OfferedServiceResponse> {
    const foundService = await this._prisma.offeredService.findUnique({
      where: { id: request.id },
    });
  
    if (!foundService) {
      throw new BadRequestException(`No se encontró un servicio con el id: ${request.id}`);
    }

    if (request.title) {
      const existingWithSameTitle = await this._prisma.offeredService.findUnique({
        where: { title: request.title },
      });
  
      if (existingWithSameTitle && existingWithSameTitle.id !== request.id) {
        throw new BadRequestException(`Ya existe otro servicio con el título: ${request.title}`);
      }
    }
  
    const data: any = {};
  
    if (request.title !== undefined) data.title = request.title;
    if (request.description !== undefined) data.description = request.description;
    if (request.price !== undefined) data.price = new Prisma.Decimal(request.price);
  
    const updatedService = await this._prisma.offeredService.update({
      where: { id: request.id },
      data,
    });
  
    return this.offeredServiceToResponse(updatedService);
  }
  
  

  offeredServiceToResponse(request: OfferedService): OfferedServiceResponse{
    return {
      id: request.id,
      description: request.description,
      title: request.title,
      price: parseFloat(request.price.toString())
    }
  }
}
