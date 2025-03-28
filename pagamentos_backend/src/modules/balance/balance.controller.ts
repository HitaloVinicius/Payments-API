import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FindBalanceDto } from './dto/find-balance.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createBalanceDto: CreateBalanceDto, @Request() req) {
    return this.balanceService.create(createBalanceDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.balanceService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') params: FindBalanceDto, @Request() req) {
    return this.balanceService.findOne(params.id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') params: FindBalanceDto, @Body() updateBalanceDto: UpdateBalanceDto, @Request() req) {
    return this.balanceService.update(params.id, updateBalanceDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') params: FindBalanceDto, @Request() req) {
    return this.balanceService.remove(params.id, req.user.id);
  }
}
