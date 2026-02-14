import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { OutcomesPaymentService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: string; username: string };
}
@Controller('outcomes/payments')
@UseGuards(JwtAuthGuard)
export class OutcomesAllPaymentsController {
  constructor(
    private readonly OutcomesPaymentService: OutcomesPaymentService,
  ) {}

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    const allPayments = await this.OutcomesPaymentService.findAll(
      req.user.userId,
    );
    return allPayments;
  }
}
