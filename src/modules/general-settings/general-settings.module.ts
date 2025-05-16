import { Module } from '@nestjs/common';
import { GeneralSettingsService } from './services/general-settings.service';
import { GeneralSettingsController } from './controllers/general-settings.controller';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [JwtService, PrismaService, GeneralSettingsService],
  exports: [GeneralSettingsService],
  controllers: [GeneralSettingsController],
})
export class GeneralSettingsModule {}
