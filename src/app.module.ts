import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/environments/.${process.env.NODE_ENV?.trim()}.env`,
      load:[databaseConfig],
      isGlobal:true
    }),
    UsersModule],
})
export class AppModule {}
