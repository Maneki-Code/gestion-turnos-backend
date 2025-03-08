import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Método que se ejecuta cuando el módulo se inicializa
  async onModuleInit() {
    await this.$connect(); // Conectar a la base de datos
  }

  // Método que se ejecuta cuando el módulo se destruye
  async onModuleDestroy() {
    await this.$disconnect(); // Desconectar de la base de datos
  }
}
