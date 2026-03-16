import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { OutcomesModule } from './outcomes/outcomes.module';
import { IncomesSourcesModule } from './incomes-sources/incomes-sources.module';
import { InvestmentSourceModule } from './investment-source/investment-source.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().min(32).required(),
        // Add any other validated environment variables here
      }),
      // Additional config options, e.g. envFilePath or validationOptions, can go here
    }),
    UsersModule,
    AuthModule,
    OutcomesModule,
    IncomesSourcesModule,
    InvestmentSourceModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
