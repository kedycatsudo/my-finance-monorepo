import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  Patch,
  Delete,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IncomesPaymentService } from './payment.service';
import { CreataIncomePaymentDto } from './dto/create-payment.dto';
import { UpdateIncomePaymentDto } from './dto/update-income-payment.dto';

interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: string; username: string };
}

@Controller('incomes/sources/:sourceId/payments')
@UseGuards(JwtAuthGuard)
export class IncomesPaymentsController {
  constructor(private readonly service: IncomesPaymentService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
    @Body() dto: CreataIncomePaymentDto,
  ) {
    return this.service.createPayment(req.user.userId, sourceId, dto);
  }

  @Patch(':paymentId')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
    @Param('paymentId') paymentId: string,
    @Body() dto: UpdateIncomePaymentDto,
  ) {
    await this.service.update(req.user.userId, sourceId, paymentId, dto);
    return { message: 'Payment updated succesfully ' };
  }

  @Delete(':paymentId')
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return await this.service.remove(req.user.userId, sourceId, paymentId);
  }
}
