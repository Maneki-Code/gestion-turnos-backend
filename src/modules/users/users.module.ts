import { Module } from '@nestjs/common';
import { ControllersController } from './controllers/controllers.controller';
import { PrismaService } from 'src/config/database/prisma/prisma.service';

@Module({
  providers: [PrismaService],
  controllers: [ControllersController]
})
export class UsersModule {}
