import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EUserRole } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(_context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<EUserRole[]>(
      'roles',
      _context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = _context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Acceso denegado, usuario no encontrado.');
    }
    
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException('Acceso denegado, rol insuficiente.');
    }
    return true;
  }
}
