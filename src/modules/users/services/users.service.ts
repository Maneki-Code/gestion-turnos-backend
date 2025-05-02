import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import { SchedulesService } from 'src/modules/schedules/services/schedules.service';
import { UserForUpdateDto } from '../dtos/userForUpdateDto.dto';

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

  async update(request: UserForUpdateDto, email: string): Promise<void>{
    const userFound = await this.findOneByEmail(email);

    if(userFound === null) throw new NotFoundException(`No se encontró usuario con el email '${email}`);
    if(request.email && userFound.email === request.email) throw new BadRequestException(`El nuevo email no puede ser igual al enterior`);
    if(request.email && await this.findOneByEmail(request.email) !== null) throw new ConflictException(`El email ingresado ya existe.`);
    
    await this._prisma.user.update({
      where: { email },
      data: {
          firstName: request.firstName || userFound.firstName,
          lastName: request.lastName || userFound.lastName,
          email: request.email || userFound.email,
      },
  });
  }

  async updatePassword(hashedPassword: string, email: string): Promise<void> {
    await this._prisma.user.update({
      where:{
        email: email
      },
      data:{
        password: hashedPassword
      }
    })
  }

}
