import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIncomesSourceDto } from './dto/create-incomes-source.dto';
import { UpdateIncomeSourceDto } from './dto/update-income-source.dto';
@Injectable()
export class IncomesSourcesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateIncomesSourceDto) {
    const source = await this.prisma.financeSources.create({
      data: {
        name: dto.name,
        description: dto.description,
        user_id: userId,
        type: 'income',
      },
    });
    return source;
  }
  async findAll(userId: string) {
    return this.prisma.financeSources.findMany({
      where: { user_id: userId, type: 'income' },
      include: { finance_payments: true },
    });
  }

  async update(userId: string, sourceId: string, dto: UpdateIncomeSourceDto) {
    const source = await this.prisma.financeSources.findUnique({
      where: { id: sourceId },
    });
    if (!source || source.user_id !== userId || source.type !== 'income')
      throw new Error('Income source not foind or unauthorized.');

    const updated_source = await this.prisma.financeSources.update({
      where: { id: sourceId },
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
    return { message: 'Source updated succesfully.', updated_source };
  }

  async remove(userId: string, sourceId: string) {
    const source = await this.prisma.financeSources.findUnique({
      where: { id: sourceId },
    });
    if (!source || source.user_id !== userId || source.type !== 'income') {
      throw new Error('Income source not found or unauthorized.');
    }

    await this.prisma.financeSources.delete({
      where: { id: sourceId },
    });
    return { message: 'Income source deleted successfully.' };
  }
}
