import {
  Controller,
  UseGuards,
  Get,
  Request,
  Body,
  Post,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { InvestmentSourceService } from './investment-source.service';
import { CreateInvestmentSourceDto } from './dto/create-investment-source.dto';
import { UpdateInvestmentSourceDto } from './dto/update-investment-source.dto';

interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: string; username: string };
}

@Controller('investment-sources')
@UseGuards(JwtAuthGuard)
export class InvestmentSourceController {
  constructor(private readonly service: InvestmentSourceService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateInvestmentSourceDto,
  ) {
    return this.service.create(req.user.userId, dto);
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.service.findAll(req.user.userId);
  }

  @Patch(':sourceId')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
    @Body() dto: UpdateInvestmentSourceDto,
  ) {
    return this.service.update(req.user.userId, sourceId, dto);
  }

  @Delete(':sourceId')
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
  ) {
    return this.service.remove(req.user.userId, sourceId);
  }
}
