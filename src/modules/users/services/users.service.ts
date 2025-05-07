import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EUserRole, User } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import { SchedulesService } from 'src/modules/schedules/services/schedules.service';
import { UserForUpdateDto } from '../dtos/userForUpdateDto.dto';
import { UserResponse } from '../dtos/user.response';
import { UserMapperService } from 'src/common/mappers/services/user-mapper.service';

@Injectable()
export class UsersService {
  
 
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _schedules: SchedulesService,
    private readonly _userMapper: UserMapperService
  ) {}

  async create(request: RegisterDto): Promise<User> {
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

  async createManager(request: RegisterDto): Promise<UserResponse> {
    const createdUser = await this._prisma.user.create({
      data: {
        ...request,
        role: EUserRole.MANAGER,
      },
    });
    if (!createdUser) throw new BadRequestException(`Algo salió mal al crear el usuario.`);
    
    await this._schedules.create(createdUser.id);

    return this._userMapper.userToFullResponse(createdUser);
  }

  async findAll():Promise<UserResponse[]> {
    const usersFound = await this._prisma.user.findMany();

    return usersFound.map(user => this._userMapper.userToFullResponse(user));
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this._prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findOneById(id: number) {
    return await this._prisma.user.findUnique({
      where: {
        id,
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

  async deleteById(id: number) {
    const userFound = await this._prisma.user.findUnique({where: {id}});

    if(!userFound) throw new NotFoundException('Usuario no encontrado.');
    if(userFound.role === EUserRole.ADMIN) throw new BadRequestException(`No es posible eliminar usuarios de tipo Administrador`);

    await this._prisma.user.delete({ where: { id } });
  }
}