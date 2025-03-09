import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: RegisterDto): Promise<User> {
    if ((await this.findOneByEmail(request.email)) !== null)
      throw new BadRequestException(`El email '${request.email} ya existe.`);

    const createdUser = await this.prismaService.user.create({
      data: {
        ...request,
        role: 'ADMIN',
      },
    });
    if (!createdUser) throw new BadRequestException(`Algo salió mal.`);
    return createdUser;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}
