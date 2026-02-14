import { CreateInvestmentSourceDto } from './dto/create-investment-source.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateInvestmentSourceDto } from './dto/update-investment-source.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InvestmentSourceService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateInvestmentSourceDto) {
    return this.prisma.investmentSources.create({
      data: {
        name: dto.name,
        description: dto.description,
        user_id: userId,
        type: dto.type,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.investmentSources.findMany({
      where: { user_id: userId },
      include: { investmentItems: true },
    });
  }

  async update(
    userId: string,
    sourceId: string,
    dto: UpdateInvestmentSourceDto,
  ) {
    const source = await this.prisma.investmentSources.findUnique({
      where: { id: sourceId },
    });
    if (!source || source.user_id !== userId)
      throw new Error('Source not found or unauthorized');
    return this.prisma.investmentSources.update({
      where: { id: sourceId },
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
      },
    });
  }

  async remove(userId: string, sourceId: string) {
    const source = await this.prisma.investmentSources.findUnique({
      where: { id: sourceId },
    });
    if (!source || source.user_id !== userId)
      throw new Error('Source not found or unauthorized');
    await this.prisma.investmentSources.delete({
      where: { id: sourceId },
    });
    return { message: 'Source deleted succesfully.' };
  }
}
