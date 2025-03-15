import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from '../services/users.service';


@Controller('users')
export class UsersController {

  constructor(private readonly _userServices:UsersService){

  }

  @ApiBearerAuth() 
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  /* @Roles('MANAGER') */
  helloFromSecured(){
    return "Hola desde un protegido";
  }

  
  @Get('/:id')
  findUserById(@Param('id')id:number){
    return this._userServices.GetUserById(id)
  }
}
