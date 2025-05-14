import { Injectable, NotFoundException } from '@nestjs/common';
import { GeneralSettingsResponse } from '../dtos/generalSettings.response';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { GeneralSettingsForUpdateDto } from '../dtos/generalSettingsForUpdateDto.dto';

@Injectable()
export class GeneralSettingsService {
  constructor(private readonly _prisma: PrismaService) {}

  async getGeneralSettings(): Promise<GeneralSettingsResponse> {
    const generalSettings = await this._prisma.generalSettings.findUnique({
      where: { id: 1 },
    });

    if (!generalSettings) {
      return await this.updateGeneralSettings({
        limitDaysToReserve: 30,
        address: 'info@empresa.com',
        phoneNumber: '+54 9 11 3333-3333',
        email: 'info@empresa.com',
      });
    }

    return {
      limitDaysToReserve: generalSettings.limitDaysToReserve,
      address: generalSettings.address ?? '',
      phoneNumber: generalSettings.phoneNumber ?? '',
      email: generalSettings.email ?? '',
    };
  }

  async updateGeneralSettings(
    generalSettings: GeneralSettingsForUpdateDto,
  ): Promise<GeneralSettingsResponse> {
    const updatedGeneralSettings = await this._prisma.generalSettings.upsert({
      where: { id: 1 },
      update: {
        limitDaysToReserve: generalSettings.limitDaysToReserve ?? undefined,
        address: generalSettings.address ?? undefined,
        phoneNumber: generalSettings.phoneNumber ?? undefined,
        email: generalSettings.email ?? undefined,
      },
      create: {
        id: 1,
        limitDaysToReserve: generalSettings.limitDaysToReserve ?? 30, 
        address: generalSettings.address ?? undefined,
        phoneNumber: generalSettings.phoneNumber ?? undefined,
        email: generalSettings.email ?? undefined,
      },
    });
  
    return {
      limitDaysToReserve: updatedGeneralSettings.limitDaysToReserve,
      address: updatedGeneralSettings.address ?? '',
      phoneNumber: updatedGeneralSettings.phoneNumber ?? '',
      email: updatedGeneralSettings.email ?? '',
    };
  }
}
