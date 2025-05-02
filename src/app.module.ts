import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { PrismaService } from './config/database/prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { TimeService } from './common/time/time.service';
import { CustomersModule } from './modules/customers/customers.module';
import { ValidationsModule } from './common/validations/validations.module';
import { MappersModule } from './common/mappers/mappers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load:[appConfig, databaseConfig],
      isGlobal:true
    }),
    UsersModule,
    AuthModule,
    SchedulesModule,
    AppointmentsModule,
    CustomersModule,
    ValidationsModule,
    MappersModule],
  providers: [PrismaService, TimeService],
  exports: [PrismaService, TimeService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); 
  }
}
