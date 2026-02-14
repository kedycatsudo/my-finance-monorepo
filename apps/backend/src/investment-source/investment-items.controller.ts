import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { InvestmentItemsService } from './investment-items.service';
import { CreateInvestmentItemDto } from './dto/create-investment-item.dto';
import { UpdateInvestmentItemDto } from './dto/update-investment-item.dto';

interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: string; username: string };
}

@Controller('investment-sources/:sourceId/items')
@UseGuards(JwtAuthGuard)
export class InvestmentItemsController {
  constructor(private readonly service: InvestmentItemsService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
    @Body() dto: CreateInvestmentItemDto,
  ) {
    return this.service.create(req.user.userId, sourceId, dto);
  }

  @Get()
  async findbySourceId(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
  ) {
    return this.service.findbySourceId(req.user.userId, sourceId);
  }

  @Get(':itemId')
  async findOne(
    @Request() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
  ) {
    return this.service.findOne(req.user.userId, itemId);
  }

  @Patch(':itemId')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateInvestmentItemDto,
  ) {
    return this.service.update(req.user.userId, itemId, dto);
  }

  @Delete(':itemId')
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
  ) {
    return this.service.remove(req.user.userId, itemId);
  }
}
