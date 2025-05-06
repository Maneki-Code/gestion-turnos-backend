import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserResponse } from 'src/modules/users/dtos/user.response';

@Injectable()
export class UserMapperService {
  
  userToFullResponse(user:User): UserResponse{
    return {
      id: user.id,
      firstName: user.firstName,
      lastname: user.lastName,
      email: user.email,
      role: user.role
    }
  }
}
