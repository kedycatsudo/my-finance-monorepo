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
import { OutcomesService } from './outcomes.service';
import { Request as ExpressRequest } from 'express';
import { CreateOutcomeSourceDto } from './dto/create-source.dto';
import { UpdateOutcomeSourceDto } from './dto/update-source.dto';
interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: string; username: string };
}
@Controller('outcomes/sources')
@UseGuards(JwtAuthGuard)
export class OutcomesController {
  constructor(private readonly outcomesService: OutcomesService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateOutcomeSourceDto,
  ) {
    const source = await this.outcomesService.create(req.user.userId, dto);
    return source;
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    const sources = await this.outcomesService.findAll(req.user.userId);
    return sources;
  }

  @Patch(':sourceId')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
    @Body() dto: UpdateOutcomeSourceDto,
  ) {
    return this.outcomesService.update(req.user.userId, sourceId, dto);
  }
  @Delete(':sourceId')
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param('sourceId') sourceId: string,
  ) {
    return this.outcomesService.remove(req.user.userId, sourceId);
  }
}
