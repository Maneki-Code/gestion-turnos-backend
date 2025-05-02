import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CustomerResponse } from '../dtos/customer.response';
import { CustomerForUpdateDto } from '../dtos/customerForUpdateDto.dto';
import { CustomerForCreationDto } from '../dtos/customerForCreationDto.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated.response';

@Controller('customers')
export class CustomersController {
  constructor(private readonly _customerService: CustomersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() request: CustomerForCreationDto) {
    await this._customerService.create(request);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(): Promise<CustomerResponse[]> {
    return await this._customerService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<PaginatedResponse<CustomerResponse>> {
    const skip = (page - 1) * limit;

    return await this._customerService.searchCustomers(
      query.trim(),
      skip,
      limit,
      page,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch()
  async updateCustomer(@Body() request: CustomerForUpdateDto) {
    await this._customerService.updateCustomer(request);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteCustomer(@Param('id') id: number) {
    await this._customerService.deleteCustomer(id);
  }
}
