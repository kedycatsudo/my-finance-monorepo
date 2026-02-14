import { Module } from '@nestjs/common';
import { InvestmentSourceController } from './investment-source.controller';
import { InvestmentSourceService } from './investment-source.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvestmentItemsService } from './investment-items.service';
import { InvestmentItemsController } from './investment-items.controller';
import { AllInvestmentItemsController } from './allItems.controller';
@Module({
  controllers: [
    InvestmentSourceController,
    InvestmentItemsController,
    AllInvestmentItemsController,
  ],
  providers: [InvestmentSourceService, PrismaService, InvestmentItemsService],
})
export class InvestmentSourceModule {}
