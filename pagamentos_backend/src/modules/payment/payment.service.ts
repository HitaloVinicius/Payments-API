import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name)
  constructor(private prisma: PrismaService) { }

  private async checkUser(userId: string, balanceId: string) {
    const balance = await this.prisma.balances.findUnique({
      where: {
        user_id: userId,
        id: balanceId
      }
    })
    if (!balance) {
      this.logger.error('UnauthorizedException -- O usuário não tem permissão para acessar este saldo.')
      throw new UnauthorizedException('O usuário não tem permissão para acessar este saldo.')
    }
    return balance
  }

  private async checkPayment(userId: string, paymentId: string) {
    const payment = await this.prisma.payments.findUnique({
      where: {
        id: paymentId
      }
    })
    if (!payment) {
      this.logger.error('NotFoundException -- Pagamento não encontrado.')
      throw new NotFoundException('Pagamento não encontrado.')
    }
    if (payment.user_id !== userId) {
      this.logger.error('UnauthorizedException -- O usuário não tem permissão para acessar este pagamento.')
      throw new UnauthorizedException('O usuário não tem permissão para acessar este pagamento.')
    }
    return payment
  }

  async create(data: CreatePaymentDto, userId: string) {
    const { balanceId, value } = data

    const balance = await this.checkUser(userId, balanceId)
    const remainingValue = balance.remaining_value - value

    if (remainingValue < 0) {
      this.logger.error('UnprocessableEntityException -- Saldo insuficiente para realizar o pagamento.')
      throw new UnprocessableEntityException('Saldo insuficiente para realizar o pagamento.')
    }

    const paymentId = await this.prisma.$transaction(async (prisma) => {
      const payment = await prisma.payments.create({
        data: {
          name: data.name,
          description: data.description,
          value,
          balance_id: balanceId,
          user_id: userId
        }
      })

      await prisma.balances.update({
        where: {
          id: balanceId
        },
        data: {
          remaining_value: remainingValue
        }
      })

      return payment.id
    })

    this.logger.log('create -- Success')
    return {
      message: 'Pagamento feito com sucesso!',
      paymentId
    };
  }

  async findAll(userId: string) {
    const payments = await this.prisma.payments.findMany({
      where: {
        user_id: userId
      },
      orderBy: {
        created_at: 'desc'
      },
      select: {
        id: true,
        name: true,
        value: true,
        created_at: true
      }
    })
    this.logger.log('findAll -- Success')
    return payments
  }

  async findOne(id: string, userId: string) {
    const payment = await this.checkPayment(userId, id)
    this.logger.log('findOne -- Success')
    return payment
  }

  async update(id: string, data: UpdatePaymentDto, userId: string) {
    if (!data.name && !data.description) {
      this.logger.error('BadRequestException -- name e description não podem estar ambos vazios.')
      throw new BadRequestException('name e description não podem estar ambos vazios.')
    }
    await this.checkPayment(userId, id)
    await this.prisma.payments.update({
      data,
      where: {
        id
      }
    })
    this.logger.log('update -- Success')
    return {
      message: 'Pagamento Editado com sucesso!',
      paymentId: id,
    };
  }

  async remove(id: string, userId: string) {
    const payment = await this.prisma.payments.findUnique({
      where: {
        id
      },
      include: {
        balance: true
      }
    })
    if (!payment) {
      this.logger.error('NotFoundException -- Pagamento não encontrado.')
      throw new NotFoundException('Pagamento não encontrado.')
    }
    if (payment.user_id !== userId) {
      this.logger.error('UnauthorizedException -- O usuário não tem permissão para acessar este pagamento.')
      throw new UnauthorizedException('O usuário não tem permissão para acessar este pagamento.')
    }

    const newBalanceValue = Number(payment?.balance?.remaining_value) + Number(payment.value)

    await this.prisma.$transaction(async (prisma) => {
      await prisma.balances.update({
        where: {
          id: payment.balance_id!
        },
        data: {
          remaining_value: newBalanceValue
        }
      })

      await prisma.payments.delete({
        where: {
          id
        }
      })
    })

    this.logger.log('remove -- Success')
    return {
      message: 'Pagamento excluído com sucesso!',
      paymentId: id,
    };
  }
}
