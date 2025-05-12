import { Injectable } from '@nestjs/common';
import { OfferedService } from '@prisma/client';
import { OfferedServiceResponse } from 'src/modules/offered-services/dtos/offeredService.response';

@Injectable()
export class OfferedServicesMapperService {
  offeredServiceToResponse(request: OfferedService): OfferedServiceResponse{
    return {
      id: request.id,
      description: request.description,
      title: request.title,
      price: parseFloat(request.price.toString())
    }
  }
}
