import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from '../services/users.service';
import { RequestWithUser } from 'src/common/interfaces/requestWithUser.interface';
import { UserForUpdateDto } from '../dtos/userForUpdateDto.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly _userServices:UsersService){}

  @ApiBearerAuth() 
  @Patch('update-profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async helloFromSecured(@Body() request: UserForUpdateDto, @Req() req: RequestWithUser){
    const email = req.user.email;
    await this._userServices.update(request, email);
  }

}
