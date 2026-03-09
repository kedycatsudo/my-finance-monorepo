import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInvestmentItemDto } from './dto/create-investment-item.dto';
import { UpdateInvestmentItemDto } from './dto/update-investment-item.dto';
import { Prisma, $Enums } from '@prisma/client';

function normalizeDateTime(value?: string | null): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (value.includes('T')) return value;
  return `${value}T00:00:00.000Z`;
}

@Injectable()
export class InvestmentItemsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    investmentSourceId: string,
    dto: CreateInvestmentItemDto,
  ) {
    return this.prisma.investmentItems.create({
      data: {
        user_id: userId,
        investment_source_id: investmentSourceId,
        asset_name: dto.asset_name,
        term: (dto.term as $Enums.investment_term) ?? $Enums.investment_term,
        invested_amount: dto.invested_amount,
        entry_date: normalizeDateTime(dto.entry_date) ?? dto.entry_date,
        exit_date: normalizeDateTime(dto.exit_date),
        result:
          (dto.result as $Enums.investment_result) ?? $Enums.investment_result,
        result_amount: dto.result_amount,
        status:
          (dto.status as $Enums.investment_status) ?? $Enums.investment_status,
      },
    });
  }

  async findbySourceId(userId: string, investmentSourceId: string) {
    return this.prisma.investmentItems.findMany({
      where: { user_id: userId, investment_source_id: investmentSourceId },
      include: { investmentSource: true },
    });
  }
  async findAll(userId: string) {
    return this.prisma.investmentItems.findMany({
      where: { user_id: userId },
      include: { investmentSource: true },
    });
  }
  async findOne(userId: string, itemId: string) {
    const item = await this.prisma.investmentItems.findUnique({
      where: { id: itemId },
      include: { investmentSource: true },
    });
    if (!item || item.user_id !== userId)
      throw new Error('Investment item not found or unauthorized');
    return item;
  }

  async update(userId: string, itemId: string, dto: UpdateInvestmentItemDto) {
    const item = await this.prisma.investmentItems.findUnique({
      where: { id: itemId },
    });
    if (!item || item.user_id !== userId)
      throw new Error('Investment item not found or unauthorized');

    const normalizedDto: UpdateInvestmentItemDto = {
      ...dto,
      ...(dto.entry_date !== undefined
        ? { entry_date: normalizeDateTime(dto.entry_date) ?? undefined }
        : {}),
      ...(dto.exit_date !== undefined
        ? { exit_date: normalizeDateTime(dto.exit_date) ?? undefined }
        : {}),
    };

    return this.prisma.investmentItems.update({
      where: { id: itemId },
      data: { ...normalizedDto },
    });
  }

  async remove(userId: string, itemId: string) {
    const item = await this.prisma.investmentItems.findUnique({
      where: { id: itemId },
    });
    if (!item || item.user_id !== userId)
      throw new Error('Investment item not found or unauthorized');
    await this.prisma.investmentItems.delete({
      where: { id: itemId },
    });
    return { message: 'Investment item deleted succesfully.' };
  }
}
