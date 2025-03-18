import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { promises } from 'dns';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import { UserResponse } from '../dtos/user.response';

@Injectable()
export class UsersService {
  constructor(private readonly _prisma: PrismaService) {}

  async create(request: RegisterDto): Promise<User> {
    if ((await this.findOneByEmail(request.email)) !== null)
      throw new BadRequestException(`El email '${request.email}' ya existe.`);

    const createdUser = await this._prisma.user.create({
      data: {
        ...request,
        role: 'ADMIN',
      },
    });
    if (!createdUser) throw new BadRequestException(`Algo salió mal al crear el usuario.`);
    const createdSchedule = await this._prisma.schedule.create({
      data: {
        description: "Horario predeterminado",
        user: {
          connect: { id: createdUser.id }  // Relaciona el usuario por su ID
        }
      }
    });
    if(!createdSchedule) throw new BadRequestException(`Algo salió mal al crear la agenda asociada al usuario.`);

    return createdUser;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this._prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async GetUserById(id:number):Promise<UserResponse>{
    const usuario =  await this._prisma.user.findUnique({
      where: {
        id,
      },
    });
    if(!usuario) throw new NotFoundException('No se encontró el usuario');
    return {id:usuario?.id, firstName:usuario.firstName, lastname:usuario?.lastName, email:usuario.email}
  }
}
