import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { IncomesPaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: string; username: string };
}

@Controller('incomes/payments')
@UseGuards(JwtAuthGuard)
export class IncomesAllPaymentsController {
  constructor(private readonly incomesPaymentService: IncomesPaymentService) {}

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    const allPayments = await this.incomesPaymentService.findAll(
      req.user.userId,
    );
    return allPayments;
  }
}
