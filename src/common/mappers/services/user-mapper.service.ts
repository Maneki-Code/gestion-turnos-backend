import { Injectable } from '@nestjs/common';
import { OfferedService, User } from '@prisma/client';
import { UserResponse } from 'src/modules/users/dtos/user.response';
import { OfferedServicesMapperService } from './offered-services-mapper.service';
@Injectable()
export class UserMapperService {
  constructor(private readonly _offeredServicesMapper: OfferedServicesMapperService) {}
  userToFullResponse(user:User & {offeredServices: OfferedService[]}): UserResponse{
    return {
      id: user.id,
      firstName: user.firstName,
      lastname: user.lastName,
      email: user.email,
      role: user.role,
      offeredServices: user.offeredServices.map(service => this._offeredServicesMapper.offeredServiceToResponse(service))
    }
  }
}
