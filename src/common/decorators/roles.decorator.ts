import { SetMetadata } from '@nestjs/common';
import { EUserRole } from '@prisma/client';

export const Roles = (...roles: EUserRole[]) => SetMetadata('roles', roles);