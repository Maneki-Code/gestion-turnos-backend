import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GeneralSettingsService } from '../services/general-settings.service';
import { GeneralSettingsResponse } from '../dtos/generalSettings.response';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GeneralSettingsForUpdateDto } from '../dtos/generalSettingsForUpdateDto.dto';


@Controller('general-settings')
export class GeneralSettingsController {
  constructor(private readonly _service: GeneralSettingsService) {}

  @Get()
  async getGeneralSettings(): Promise<GeneralSettingsResponse> {
    return await this._service.getGeneralSettings();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch()
  async updateGeneralSettings(@Body() generalSettings: GeneralSettingsForUpdateDto): Promise<GeneralSettingsResponse> {
    return await this._service.updateGeneralSettings(generalSettings);
  }
}
