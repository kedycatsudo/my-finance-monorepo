import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, $Enums } from '@prisma/client';
import { CreataIncomePaymentDto } from './dto/create-payment.dto';
import { UpdateIncomePaymentDto } from './dto/update-income-payment.dto';

@Injectable()
export class IncomesPaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(
    userId: string,
    sourceId: string,
    dto: CreataIncomePaymentDto,
  ) {
    const source = await this.prisma.financeSources.findFirst({
      where: { id: sourceId, user_id: userId, type: 'income' },
    });
    if (!source) throw new Error('Source not found or unauthorized.');
    const newPayment = await this.prisma.financePayments.create({
      data: {
        name: dto.name,
        user_id: userId,
        amount: dto.amount,
        loop: dto.loop,
        status: (dto.status as $Enums.payment_status) ?? $Enums.payment_status,
        payment_type:
          (dto.payment_type as $Enums.payment_type) ??
          $Enums.payment_type.credit,
        financesource_id: sourceId,
      },
    });
    console.log('new payment after created from payment service', newPayment);
    return newPayment;
  }

  async findAll(userId: string) {
    return this.prisma.financePayments.findMany({
      where: { user_id: userId, finance_sources: { type: 'income' } },
      include: { finance_sources: true },
    });
  }

  async update(
    userId: string,
    sourceId: string,
    paymentId: string,
    dto: UpdateIncomePaymentDto,
  ) {
    const payment = await this.prisma.financePayments.findUnique({
      where: { id: paymentId },
      include: { finance_sources: true },
    });

    if (
      !payment ||
      payment.user_id !== userId ||
      payment.financesource_id !== sourceId
    ) {
      throw new Error('Payment not found or unauthorized.');
    }
    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.amount !== undefined) updateData.amount = dto.amount;
    if (dto.payment_type !== undefined)
      updateData.payment_type = dto.payment_type as $Enums.payment_type;
    if (dto.payment_circle_date !== undefined)
      updateData.payment_circle_date = dto.payment_circle_date;
    if (dto.loop !== undefined) updateData.loop = dto.loop;
    if (dto.status !== undefined)
      updateData.status = dto.status as $Enums.payment_status;
    updateData.financesource_id = sourceId;

    return this.prisma.financePayments.update({
      where: { id: paymentId },
      data: updateData,
    });
  }

  async remove(userId: string, sourceId: string, paymentId: string) {
    const payment = await this.prisma.financePayments.findUnique({
      where: { id: paymentId },
    });
    if (
      !payment ||
      payment.user_id !== userId ||
      payment.financesource_id !== sourceId
    ) {
      throw new Error('Payment not found or unauthorized.');
    }
    await this.prisma.financePayments.delete({
      where: { id: paymentId },
    });
    return { message: 'Payment deleted succesfully.' };
  }
}
