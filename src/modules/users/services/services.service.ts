import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';

@Injectable()
export class ServicesService {
    constructor(private readonly prismaService:PrismaService){}
}
