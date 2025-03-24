import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FindPaymentDto } from './dto/find-payment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentService.create(createPaymentDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.paymentService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') params: FindPaymentDto, @Request() req) {
    return this.paymentService.findOne(params.id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') params: FindPaymentDto, @Body() updatePaymentDto: UpdatePaymentDto, @Request() req) {
    return this.paymentService.update(params.id, updatePaymentDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') params: FindPaymentDto, @Request() req) {
    return this.paymentService.remove(params.id, req.user.id);
  }
}
