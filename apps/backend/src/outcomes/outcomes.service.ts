import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOutcomeSourceDto } from './dto/create-source.dto';
import { UpdateOutcomeSourceDto } from './dto/update-source.dto';
import { $Enums } from '@prisma/client';

@Injectable()
export class OutcomesService {
  constructor(private prisma: PrismaService) {}

  private normalizeDate(value?: string | Date | null): Date | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    if (value instanceof Date) return value;

    const str = String(value).trim();
    if (str.includes('T')) {
      const parsed = new Date(str);
      if (Number.isNaN(parsed.getTime()))
        throw new Error('Invalid date format');
      return parsed;
    }

    const dateOnly = new Date(`${str}T00:00:00.000Z`);
    if (Number.isNaN(dateOnly.getTime()))
      throw new Error('Invalid date format');
    return dateOnly;
  }

  async create(userId: string, dto: CreateOutcomeSourceDto) {
    const source = await this.prisma.financeSources.create({
      data: {
        name: dto.name,
        description: dto.description,
        user_id: userId,
        type: 'outcome',
      },
      include: { finance_payments: true },
    });
    return source;
  }

  async findAll(userId: string) {
    return this.prisma.financeSources.findMany({
      where: { user_id: userId, type: 'outcome' },
      include: { finance_payments: true },
    });
  }

  async update(userId: string, sourceId: string, dto: UpdateOutcomeSourceDto) {
    const source = await this.prisma.financeSources.findUnique({
      where: { id: sourceId },
      include: { finance_payments: true },
    });
    if (!source || source.user_id !== userId || source.type !== 'outcome')
      throw new Error('Outcome source not found or unautharized');
    await this.prisma.financeSources.update({
      where: { id: sourceId },
      data: {
        name: dto.name ?? source.name,
        description: dto.description ?? source.description,
      },
    });

    let updated_payments_count = 0;

    if (
      Array.isArray(dto.finance_payments) &&
      dto.finance_payments.length > 0
    ) {
      const paymentUpdates = await this.prisma.$transaction(
        dto.finance_payments
          .filter((payment) => !!payment?.id)
          .map((payment) =>
            this.prisma.financePayments.updateMany({
              where: {
                id: payment.id,
                financesource_id: sourceId,
              },
              data: {
                name: payment.name,
                payment_type: payment.payment_type as $Enums.payment_type,
                amount:
                  payment.amount !== undefined && payment.amount !== null
                    ? Number(payment.amount)
                    : undefined,
                date: this.normalizeDate(payment.date),
                loop: payment.loop,
                status: payment.status as $Enums.payment_status,
              },
            }),
          ),
      );

      updated_payments_count = paymentUpdates.reduce(
        (sum, result) => sum + result.count,
        0,
      );
    }

    const updated_source = await this.prisma.financeSources.findUnique({
      where: { id: sourceId },
      include: { finance_payments: true },
    });

    return {
      message: 'Source updated succesfully.',
      updated_source,
      updated_payments_count,
    };
  }

  async remove(userId: string, sourceId: string) {
    const source = await this.prisma.financeSources.findUnique({
      where: { id: sourceId },
    });
    if (!source || source.user_id !== userId || source.type !== 'outcome')
      throw new Error('Outcome source not found or unauthorized');
    await this.prisma.financeSources.delete({
      where: { id: sourceId },
    });
    return { message: 'Outcome source deleted successfully.' };
  }
}
