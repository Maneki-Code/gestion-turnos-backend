import { Module } from '@nestjs/common';
import { OfferedServicesController } from './controllers/offered-services.controller';
import { OfferedServicesService } from './services/offered-services.service';
import { MappersModule } from 'src/common/mappers/mappers.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/config/database/prisma/prisma.service';

@Module({
  imports: [MappersModule],
  providers: [JwtService, PrismaService,OfferedServicesService],
  controllers: [OfferedServicesController],
})
export class OfferedServicesModule {}
