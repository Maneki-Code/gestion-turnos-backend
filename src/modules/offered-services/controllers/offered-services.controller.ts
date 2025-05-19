import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OfferedServicesService } from '../services/offered-services.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { OfferedServiceForCreationDto } from '../dtos/offeredServiceForCreationDto.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OfferedServiceResponse } from '../dtos/offeredService.response';
import { OfferedServiceForUpdateDto } from '../dtos/offeredServiceForUpdateDto.dto';

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

  
  @Get('user-active')
  async findAllByUserActive():Promise<OfferedServiceResponse[]> {
    return await this._offeredServicesService.findAllByUserActive();
  }



  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch()
  async update(@Body() request: OfferedServiceForUpdateDto): Promise<OfferedServiceResponse> {
    return await this._offeredServicesService.update(request);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('')
  async delete(@Query(':serviceId') id: number): Promise<void> {
    return await this._offeredServicesService.delete(id);
  }
}
