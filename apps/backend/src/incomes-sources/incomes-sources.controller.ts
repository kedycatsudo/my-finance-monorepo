import {
  Controller,
  UseGuards,
  Get,
  Request,
  Body,
  Post,
  Req,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { IncomesSourcesService } from './incomes-sources.service';
import { CreateIncomesSourceDto } from './dto/create-incomes-source.dto';
import { UpdateIncomeSourceDto } from './dto/update-income-source.dto';

interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: string; username: string };
}
@Controller('incomes/sources')
@UseGuards(JwtAuthGuard)
export class IncomesSourcesController {
  constructor(private readonly service: IncomesSourcesService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateIncomesSourceDto,
  ) {
    const source = await this.service.create(req.user.userId, dto);
    return source;
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    const sources = await this.service.findAll(req.user.userId);
    return sources;
  }

  @Patch(':sourceId')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
    @Body() dto: UpdateIncomeSourceDto,
  ) {
    const updated_source = await this.service.update(
      req.user.userId,
      sourceId,
      dto,
    );

    return updated_source;
  }

  @Delete(':sourceId')
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
  ) {
    await this.service.remove(req.user.userId, sourceId);

    return { message: 'Source deleted succesfully.' };
  }
}
