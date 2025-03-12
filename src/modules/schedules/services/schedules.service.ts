import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleForCreationDto } from '../dtos/scheduleForCreationDto.dto';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class SchedulesService {
  constructor(private readonly _prisma:PrismaService, private readonly _userService:UsersService){}

  async create(request: ScheduleForCreationDto){
    const userFound = this._userService.findOneByEmail(request.userEmail);
    if(userFound===null) throw new NotFoundException(`El usuario con email '${request.userEmail} no existe`);
    /* VALIDACIONES DE QUE NO SE PISEN LOS TURNOS */
  }
}
