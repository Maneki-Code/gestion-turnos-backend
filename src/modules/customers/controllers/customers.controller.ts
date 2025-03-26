import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CustomerResponse } from '../dtos/customer.response';
import { CustomerForUpdateDto } from '../dtos/customerForUpdateDto.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly _customerService:CustomersService){}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(): Promise<CustomerResponse[]>{
    return await this._customerService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('search')
  async search(@Query('query') query: string): Promise<CustomerResponse[]> {
    if (!query) return []; 
    return await this._customerService.searchCustomers(query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch()
  async updateCustomer(@Body() request: CustomerForUpdateDto){
    return await this._customerService.updateCustomer(request);
  }
}
