import { Module } from '@nestjs/common';
import { AppointmentsService } from './services/appointments.service';
import { AppointmentsController } from './controllers/appointments.controller';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { CustomersModule } from '../customers/customers.module';
import { TimeService } from 'src/common/time/time.service';

@Module({
  imports: [CustomersModule],
  providers: [TimeService, PrismaService, AppointmentsService],
  controllers: [AppointmentsController],
  exports:[AppointmentsService]
})
export class AppointmentsModule {}
