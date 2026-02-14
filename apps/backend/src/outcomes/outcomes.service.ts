import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOutcomeSourceDto } from './dto/create-source.dto';
import { UpdateOutcomeSourceDto } from './dto/update-source.dto';

@Injectable()
export class OutcomesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOutcomeSourceDto) {
    const source = await this.prisma.financeSources.create({
      data: {
        name: dto.name,
        description: dto.description,
        user_id: userId,
        type: 'outcome',
      },
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
    });
    if (!source || source.user_id !== userId || source.type !== 'outcome')
      throw new Error('Outcome source not found or unautharized');
    await this.prisma.financeSources.update({
      where: { id: sourceId },
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
    return { message: 'Source updated succesfully.' };
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
