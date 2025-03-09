import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';


@Controller('users')
export class UsersController {

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('MANAGER')
  helloFromSecured(){
    return "Hola desde un protegido";
  }
}
