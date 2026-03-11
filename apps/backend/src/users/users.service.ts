import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany();
  }

  // SELECT * FROM users WHERE id = '<id>' LIMIT 1;
  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id=${id} not found.`);
    }
    return user;
  }
  async findByUsername(username: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { username },
    });
  }
  async create(data: CreateUserDto) {
    return this.prisma.users.create({ data });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data = { ...updateUserDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.users.update({ where: { id }, data });
  }
  async remove(id: string) {
    return this.prisma.users.delete({ where: { id } });
  }

  async runMonthlyReset(userId: string): Promise<{ deleted: number }> {
    // 1. Get the user's monthly_circle_date

    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user?.monthly_circle_date) return { deleted: 0 };

    // 2. Extract the reset day-of monthg(e.g : '2026-03-10' => 10)
    const resetDay = Number(user.monthly_circle_date.split('-')[2]);
    //3. Calculate the most recent cycle cutoff
    const today = new Date();
    const currentCycleDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      resetDay,
    );

    //If today is before this month's reset day, use last month's reset day as cutoff
    const cutoffDate =
      today >= currentCycleDate
        ? currentCycleDate
        : new Date(today.getFullYear(), today.getMonth() - 1, resetDay);

    //4. Delete all non recurring payments before the cutoff. for this user

    const result = await this.prisma.financePayments.deleteMany({
      where: {
        user_id: userId,
        loop: false,
        date: { lt: cutoffDate },
      },
    });
    return { deleted: result.count };
  }
}
