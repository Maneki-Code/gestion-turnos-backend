import { Module } from '@nestjs/common';
import { OfferedServicesController } from './controllers/offered-services.controller';
import { OfferedServicesService } from './services/offered-services.service';

@Module({
  controllers: [OfferedServicesController],
  providers: [OfferedServicesService]
})
export class OfferedServicesModule {}
