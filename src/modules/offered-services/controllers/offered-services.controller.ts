import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OfferedServicesService } from '../services/offered-services.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { OfferedServiceForCreationDto } from '../dtos/offeredServiceForCreationDto.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OfferedServiceResponse } from '../dtos/offeredService.response';

@Controller('offered-services')
export class OfferedServicesController {
  constructor(
    private readonly _offeredServicesService: OfferedServicesService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() request: OfferedServiceForCreationDto): Promise<OfferedServiceResponse> {
    return await this._offeredServicesService.create(request);
  }

  @Get()
  async findAll():Promise<OfferedServiceResponse[]> {
    return await this._offeredServicesService.findAll();
  }
}
