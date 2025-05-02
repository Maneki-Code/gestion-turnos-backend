import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from '../services/users.service';
import { RequestWithUser } from 'src/common/interfaces/requestWithUser.interface';
import { UserForUpdateDto } from '../dtos/userForUpdateDto.dto';
import { UserResponse } from '../dtos/user.response';


@Controller('users')
export class UsersController {
  constructor(private readonly _userServices:UsersService){}

  @ApiBearerAuth() 
  @Patch('update-profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async updateProfile(@Body() request: UserForUpdateDto, @Req() req: RequestWithUser){
    const email = req.user.email;
    await this._userServices.update(request, email);
  }

  @ApiBearerAuth() 
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll(): Promise<UserResponse[]>{
    return await this._userServices.findAll();
  }

  @ApiBearerAuth() 
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteById(@Param('id') id:number){
    return await this._userServices.deleteById(id);
  }
}
