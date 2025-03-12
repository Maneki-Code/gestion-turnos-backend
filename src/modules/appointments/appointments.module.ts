import { Module } from '@nestjs/common';
import { AppointmentsService } from './services/appointments.service';
import { AppointmentsController } from './controllers/appointments.controller';
import { PrismaService } from 'src/config/database/prisma/prisma.service';

@Module({
  providers: [PrismaService, AppointmentsService],
  controllers: [AppointmentsController],
  exports:[AppointmentsService]
})
export class AppointmentsModule {}
