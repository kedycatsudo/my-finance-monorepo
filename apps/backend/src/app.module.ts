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
    //Global config module loading .env and validating with Joi
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().min(32).required(),
        // Add more environment variables as needed:
        // NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        // PORT: Joi.number().default(3000),
      }),
      // Optionally, you can add validation options or load .env from custom paths
      // envFilePath: ['.env'],
      // validationOptions: { allowUnknown: true, abortEarly: false },
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
