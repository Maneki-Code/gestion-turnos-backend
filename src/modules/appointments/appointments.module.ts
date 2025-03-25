import { Module } from '@nestjs/common';
import { AppointmentsService } from './services/appointments.service';
import { AppointmentsController } from './controllers/appointments.controller';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { CustomersModule } from '../customers/customers.module';
import { TimeService } from 'src/common/time/time.service';
import { ValidationsModule } from 'src/common/validations/validations.module';

@Module({
  imports: [CustomersModule, ValidationsModule],
  providers: [TimeService, PrismaService, AppointmentsService],
  controllers: [AppointmentsController],
  exports:[AppointmentsService]
})
export class AppointmentsModule {}
