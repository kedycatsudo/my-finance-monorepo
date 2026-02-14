import { Module } from '@nestjs/common';
import { IncomesPaymentsController } from './payments.controller';
import { IncomesSourcesService } from './incomes-sources.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { IncomesSourcesController } from './incomes-sources.controller';
import { IncomesPaymentService } from './payment.service';
import { IncomesAllPaymentsController } from './allPayments.controller';
@Module({
  providers: [IncomesSourcesService, PrismaService, IncomesPaymentService],
  controllers: [
    IncomesSourcesController,
    IncomesPaymentsController,
    IncomesAllPaymentsController,
  ],
})
export class IncomesSourcesModule {}
