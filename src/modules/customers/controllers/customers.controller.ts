import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CustomerResponse } from '../dtos/customer.response';

@Controller('customers')
export class CustomersController {
  constructor(private readonly _customerService:CustomersService){}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(): Promise<CustomerResponse[]>{
    return await this._customerService.findAll();
  }

  @Get('search')
  async search(@Query('query') query: string): Promise<CustomerResponse[]> {
    if (!query) return []; // Si no hay query, devolver lista vacía
    return await this._customerService.searchCustomers(query);
  }
}
