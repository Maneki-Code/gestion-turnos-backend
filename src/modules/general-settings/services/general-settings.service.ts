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
        minAdvanceHours: 8,
      });
    }

    return {
      limitDaysToReserve: generalSettings.limitDaysToReserve,
      minAdvanceHours: generalSettings.minAdvanceHours,
    };
  }

  async updateGeneralSettings(
    generalSettings: GeneralSettingsForUpdateDto,
  ): Promise<GeneralSettingsResponse> {
    const updatedGeneralSettings = await this._prisma.generalSettings.upsert({
      where: { id: 1 },
      update: {
        limitDaysToReserve: generalSettings.limitDaysToReserve ?? undefined,
        minAdvanceHours: generalSettings.minAdvanceHours ?? undefined,
      },
      create: {
        id: 1,
        limitDaysToReserve: generalSettings.limitDaysToReserve ?? 30, 
        minAdvanceHours: generalSettings.minAdvanceHours ?? 8,
      },
    });
  
    return {
      limitDaysToReserve: updatedGeneralSettings.limitDaysToReserve,
      minAdvanceHours: updatedGeneralSettings.minAdvanceHours,
    };
  }
}
