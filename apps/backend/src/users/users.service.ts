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
}
