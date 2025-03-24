import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name)
  constructor(private prisma: PrismaService) { }

  private async checkUser(userId: string, balanceId: string) {
    const check = await this.prisma.balances.findUnique({
      where: {
        user_id: userId,
        id: balanceId
      }
    })
    if (!check) {
      this.logger.error('UnauthorizedException -- O usuário não tem permissão para acessar este saldo.')
      throw new UnauthorizedException('O usuário não tem permissão para acessar este saldo.')
    }
  }

  private async availableToDelete(balanceId: string) {
    const balance = await this.prisma.balances.findUnique({
      where: {
        id: balanceId,
        payments: {
          none: {}
        }
      }
    })

    if (!balance) {
      this.logger.error('BadRequestException -- Este saldo não pode ser excluído porque tem pagamentos relacionados a ele.')
      throw new BadRequestException('Este saldo não pode ser excluído porque tem pagamentos relacionados a ele.')
    }
  }

  async create(data: CreateBalanceDto, userId: string) {
    const balance = await this.prisma.balances.create({
      data: {
        name: data.name,
        description: data.description,
        initial_value: data.value,
        remaining_value: data.value,
        user_id: userId
      }
    })

    this.logger.log('create -- Success')
    return {
      message: 'Saldo criado com sucesso!',
      balanceId: balance.id,
    };
  }

  async findAll(userId: string) {
    const balances = await this.prisma.balances.findMany({
      where: {
        user_id: userId
      },
      select: {
        id: true,
        name: true,
        description: true,
        initial_value: true,
        remaining_value: true
      }
    })
    this.logger.log('findAll -- Success')
    return balances
  }

  async findOne(id: string, userId: string) {
    await this.checkUser(userId, id)
    const balance = await this.prisma.balances.findUnique({
      where: {
        id,
        user_id: userId
      },
      omit: {
        user_id: true
      },
      include: {
        payments: {
          select: {
            id: true,
            name: true,
            value: true,
            created_at: true
          }
        }
      }
    })
    this.logger.log('findOne -- Success')
    return balance
  }

  async update(id: string, data: UpdateBalanceDto, userId: string) {
    if (!data.name && !data.description) {
      this.logger.error('BadRequestException -- name e description não podem estar ambos vazios.')
      throw new BadRequestException('name e description não podem estar ambos vazios.')
    }
    await this.checkUser(userId, id)
    const balance = await this.prisma.balances.update({
      data,
      where: {
        id
      }
    })

    this.logger.log('update -- Success')
    return {
      message: 'Saldo Editado com sucesso!',
      balanceId: balance.id,
    };
  }

  async remove(id: string, userId: string) {
    await this.checkUser(userId, id)
    await this.availableToDelete(id)
    await this.prisma.balances.delete({
      where: {
        id
      }
    })
    this.logger.log('remove -- Success')
    return {
      message: 'Saldo excluído com sucesso!',
      balanceId: id,
    };
  }
}
