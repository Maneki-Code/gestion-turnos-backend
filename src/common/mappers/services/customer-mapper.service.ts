import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { CustomerResponse } from 'src/modules/customers/dtos/customer.response';

@Injectable()
export class CustomerMapperService {
  customerToFullResponse(request: Customer):CustomerResponse{
      return {
        id: request.id,
        firstName: request.firstName,
        lastName: request. lastName,
        phoneNumber: request.phoneNumber,
        email: request.email ?? ''
      }
    }
}
