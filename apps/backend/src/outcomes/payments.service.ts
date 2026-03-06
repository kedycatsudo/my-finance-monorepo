import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOutcomePaymentDto } from './dto/create-payment.dto';
import { Prisma, $Enums } from '@prisma/client';
import { UpdateOutcomePaymentDto } from './dto/update-payment.dto';
@Injectable()
export class OutcomesPaymentService {
  constructor(private prisma: PrismaService) {}

  private normalizeDate(value?: string | Date | null): Date | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    if (value instanceof Date) return value;

    const str = String(value).trim();

    if (str.includes('T')) {
      const isoDate = new Date(str);
      if (Number.isNaN(isoDate.getTime())) {
        throw new Error('Invalid date format');
      }
      return isoDate;
    }

    const dateOnly = new Date(`${str}T00:00:00.000Z`);
    if (Number.isNaN(dateOnly.getTime())) {
      throw new Error('Invalid date format');
    }
    return dateOnly;
  }

  async createPayment(
    userId: string,
    sourceId: string,
    dto: CreateOutcomePaymentDto,
  ) {
    const source = await this.prisma.financeSources.findFirst({
      where: { id: sourceId, user_id: userId, type: 'outcome' },
    });
    if (!source) throw new Error('Source not found or unautharized.');

    const normalizedDate = this.normalizeDate(dto.date);

    return this.prisma.financePayments.create({
      data: {
        name: dto.name,
        user_id: userId,
        amount: dto.amount,
        loop: dto.loop,
        status:
          (dto.status as $Enums.payment_status) ?? $Enums.payment_status.coming,
        payment_type:
          (dto.payment_type as $Enums.payment_type) ??
          $Enums.payment_type.credit,
        financesource_id: sourceId,
        date: normalizedDate ?? null,
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
    if (dto.date !== undefined) updateData.date = this.normalizeDate(dto.date);
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
