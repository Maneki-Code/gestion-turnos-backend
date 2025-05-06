import { Module } from '@nestjs/common';
import { AppointmentsService } from './services/appointments.service';
import { AppointmentsController } from './controllers/appointments.controller';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { CustomersModule } from '../customers/customers.module';
import { TimeService } from 'src/common/time/time.service';
import { ValidationsModule } from 'src/common/validations/validations.module';
import { MappersModule } from 'src/common/mappers/mappers.module';
import { JwtService } from '@nestjs/jwt';
import { OfferedServicesModule } from '../offered-services/offered-services.module';

@Module({
  imports: [OfferedServicesModule, MappersModule, CustomersModule, ValidationsModule],
  providers: [TimeService, JwtService, PrismaService, AppointmentsService],
  controllers: [AppointmentsController],
  exports:[AppointmentsService]
})
export class AppointmentsModule {}
