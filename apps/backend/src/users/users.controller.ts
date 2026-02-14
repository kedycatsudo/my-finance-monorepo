import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  Patch,
  Request,
  Delete,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { users } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: string; username: string };
}
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<users[]> {
    return this.usersService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<users> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException(`User with id=${id} not found.`);
    return user;
  }
  @Post()
  async create(@Body() CreateUserDto: CreateUserDto): Promise<users> {
    return this.usersService.create(CreateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @Request() req: AuthenticatedRequest,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.userId, UpdateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async removeMe(@Request() req: AuthenticatedRequest) {
    await this.usersService.remove(req.user.userId);
    return { message: 'User removed' };
  }
}
