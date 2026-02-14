import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOutcomePaymentDto } from './dto/create-payment.dto';
import { Prisma, $Enums } from '@prisma/client';
import { UpdateOutcomePaymentDto } from './dto/update-payment.dto';
@Injectable()
export class OutcomesPaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(
    userId: string,
    sourceId: string,
    dto: CreateOutcomePaymentDto,
  ) {
    const source = await this.prisma.financeSources.findFirst({
      where: { id: sourceId, user_id: userId, type: 'outcome' },
    });
    if (!source) throw new Error('Source not found or unautharized.');

    return this.prisma.financePayments.create({
      data: {
        name: dto.name,
        user_id: userId,
        amount: dto.amount,
        loop: dto.loop,
        status: (dto.status as $Enums.payment_status) ?? $Enums.payment_status,
        payment_type:
          (dto.payment_type as $Enums.payment_type) ?? $Enums.payment_type,
        financesource_id: sourceId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.financePayments.findMany({
      where: { user_id: userId, finance_sources: { type: 'outcome' } },
      include: { finance_sources: true },
    });
  }

  // udpate
  async update(
    userId: string,
    sourceId: string,
    paymentId: string,
    dto: UpdateOutcomePaymentDto,
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
    // Build update data object with only defined fields
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
    // Always update financesource_id
    updateData.financesource_id = sourceId;
    return this.prisma.financePayments.update({
      where: { id: paymentId },
      data: updateData,
    });
  }

  //remove

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
