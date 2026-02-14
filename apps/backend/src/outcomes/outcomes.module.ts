import { Module } from '@nestjs/common';
import { OutcomesController } from './outcomes.controller';
import { OutcomesService } from './outcomes.service';
import { PrismaService } from '../prisma/prisma.service';
import { OutcomesPaymentService } from './payments.service';
import { OutcomesPaymentsController } from './payments.controller';
import { OutcomesAllPaymentsController } from './allPayments.controller';
@Module({
  controllers: [
    OutcomesController,
    OutcomesPaymentsController,
    OutcomesAllPaymentsController,
  ],
  providers: [OutcomesService, PrismaService, OutcomesPaymentService],
})
export class OutcomesModule {}
