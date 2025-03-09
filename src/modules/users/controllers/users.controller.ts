import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@Controller('users')
export class UsersController {

  @Get()
  @UseGuards(AuthGuard)
  helloFromSecured(){
    return "Hola desde un protegido";
  }
}
