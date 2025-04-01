import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import { UserResponse } from '../dtos/user.response';
import { SchedulesService } from 'src/modules/schedules/services/schedules.service';
import { ChangePasswordDto } from 'src/modules/auth/dtos/changePasswordDto.dto';

@Injectable()
export class UsersService {
  
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _schedules: SchedulesService
  ) {}

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
    
    await this._schedules.create(createdUser.id);

    return createdUser;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this._prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async updatePassword(request: ChangePasswordDto) {
    await this._prisma.user.update({
      where:{
        email: request.email
      },
      data:{
        password: request.newPassword
      }
    })
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
