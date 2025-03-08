import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './config/database/prisma/prisma.service';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load:[appConfig, databaseConfig],
      isGlobal:true
    }),
    UsersModule],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
