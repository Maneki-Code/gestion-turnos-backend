import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { PrismaService } from './config/database/prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load:[appConfig, databaseConfig],
      isGlobal:true
    }),
    UsersModule,
    AuthModule],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); 
  }
}
