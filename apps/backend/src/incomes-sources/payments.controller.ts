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
import { PrismaService } from 'src/prisma/prisma.service';

interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: string; username: string };
}

@Controller('incomes/sources/:sourceId/payments')
@UseGuards(JwtAuthGuard)
export class IncomesPaymentsController {
  constructor(
    private readonly service: IncomesPaymentService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
    @Body() dto: CreataIncomePaymentDto,
  ) {
    console.log('req body in ', req.body);
    return this.service.createPayment(req.user.userId, sourceId, dto);
  }

  @Patch(':paymentId')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
    @Param('paymentId') paymentId: string,
    @Body() dto: UpdateIncomePaymentDto,
  ) {
    const updated = await this.service.update(
      req.user.userId,
      sourceId,
      paymentId,
      dto,
    );
    // Fetch the complete source with all updated payments
    const updated_source = await this.prisma.financeSources.findUnique({
      where: { id: sourceId },
      include: { finance_payments: true },
    });
    return { message: 'Payment updated successfully', updated_source };
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
