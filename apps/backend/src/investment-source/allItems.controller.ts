import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { InvestmentItemsService } from './investment-items.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: string; username: string };
}

@Controller('investment-sources/items')
@UseGuards(JwtAuthGuard)
export class AllInvestmentItemsController {
  constructor(private readonly service: InvestmentItemsService) {}

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    const allPayments = await this.service.findAll(req.user.userId);
    return allPayments;
  }
}
