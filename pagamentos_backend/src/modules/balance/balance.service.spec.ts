import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('BalanceService', () => {
  let balanceService: BalanceService;
  let prismaService: any;

  const mockDb = {
    users: [
      {
        id: '6752b1b0-2464-47d4-a0d3-c399141e5943',
        name: 'Leonard Hofstadter',
        email: 'leonard.hofstadter@incentive.me',
      },
      {
        id: '257849a8-0829-4384-a131-fc5645ba7dc9',
        name: 'Sheldon Cooper',
        email: 'sheldon.cooper@incentive.me',
      }
    ],
    balances: [
      {
        id: 'a2197290-534d-43e1-8e8f-6d792db350ed',
        name: 'Saldo 1',
        description: 'Saldo 1 description',
        initial_value: 1000,
        remaining_value: 1000,
        user_id: '6752b1b0-2464-47d4-a0d3-c399141e5943'
      },
      {
        id: 'e7ced213-9f00-47f0-b6af-6968720bfcc7',
        name: 'Saldo 2',
        description: null,
        initial_value: 1500,
        remaining_value: 1200,
        user_id: '6752b1b0-2464-47d4-a0d3-c399141e5943'
      },
      {
        id: '3c8c395e-1cd7-45d2-b9bd-4050bf715940',
        name: 'Saldo 3',
        description: 'Saldo 3 description',
        initial_value: 2000,
        remaining_value: 1000,
        user_id: '257849a8-0829-4384-a131-fc5645ba7dc9'
      },
    ]
  }

  const mockPrismaService = {
    balances: {
      create: jest.fn().mockReturnValue({ id: '4d36ef3e-226d-4c18-8d9f-f288083387c5' }),
      findMany: jest.fn().mockImplementation(({ where }) =>
        mockDb.balances.filter((element) =>
          (element.user_id === where.user_id))),
      findUnique: jest.fn().mockImplementation(({ where }) =>
        mockDb.balances.find((element) =>
          (element.id === where.id && element.user_id === where.user_id))),
      update: jest.fn().mockImplementation(({ where }) => { return { balanceId: where.id } }
      ),
      delete: jest.fn()
    },
    users: {
      findUnique: jest.fn().mockImplementation(({ where }) =>
        mockDb.users.find((element) => (element.id === where.id))),
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }],
    }).compile();
    balanceService = module.get<BalanceService>(BalanceService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(balanceService).toBeDefined();
  });

  describe('createBalance', () => {
    it('should be create balance with valid user', async () => {
      const data: CreateBalanceDto = {
        name: 'Saldo 4',
        value: 1200.50
      }
      const result = await balanceService.create(data, '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual({
        message: 'Saldo criado com sucesso!',
        balanceId: result.balanceId,
      })
    })
  })

  describe('findAllBalances', () => {
    it('should be return valid balances', async () => {
      const result = await balanceService.findAll('6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual([mockDb.balances[0], mockDb.balances[1]])
    })
  })

  describe('findOneBalance', () => {
    it('should be not return balance with invalid users', async () => {
      const result = balanceService.findOne(
        'a2197290-534d-43e1-8e8f-6d792db350ed',
        '6752b1b0-2464-47d4-a0d3-c359144e5144')
      await expect(result).rejects.toThrow(UnauthorizedException);
    })

    it('should be return one balance', async () => {
      const result = await balanceService.findOne(
        'a2197290-534d-43e1-8e8f-6d792db350ed',
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual(mockDb.balances[0])
    })
  })

  describe('updateBalance', () => {
    it('should be return UnauthorizedException with invalid user', async () => {
      const result = balanceService.update(
        'a2197290-534d-43e1-8e8f-6d792db350ed',
        {
          name: 'name1',
          description: 'description1'
        },
        '6752b1b0-2464-47d4-a0d3-c359144e5144')
      await expect(result).rejects.toThrow(UnauthorizedException);
    })

    it('should be return BadRequestException with invalid body', async () => {
      const result = balanceService.update(
        'a2197290-534d-43e1-8e8f-6d792db350ed',
        {},
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      await expect(result).rejects.toThrow(BadRequestException);
    })

    it('should be update balance with valid name', async () => {
      const body = { name: "name1" }
      const result = await balanceService.update(
        'a2197290-534d-43e1-8e8f-6d792db350ed',
        body,
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual({
        message: 'Saldo Editado com sucesso!',
        balanceId: result.balanceId,
      })
    })

    it('should be update balance with valid description', async () => {
      const body = { description: "description1" }
      const result = await balanceService.update(
        'a2197290-534d-43e1-8e8f-6d792db350ed',
        body,
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual({
        message: 'Saldo Editado com sucesso!',
        balanceId: result.balanceId,
      })
    })

    it('should be update balance with valid name and description', async () => {
      const body = { name: "name1", description: "description1" }
      const result = await balanceService.update(
        'a2197290-534d-43e1-8e8f-6d792db350ed',
        body,
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual({
        message: 'Saldo Editado com sucesso!',
        balanceId: result.balanceId,
      })
    })
  })

  describe('deleteBalance', () => {
    it('should be return UnauthorizedException with invalid user', async () => {
      const result = balanceService.remove(
        'a2197290-534d-43e1-8e8f-6d792db350ed',
        '6752b1b0-2464-47d4-a0d3-c359144e5144')
      await expect(result).rejects.toThrow(UnauthorizedException);
    })

    it('should be delete balance without payments', async () => {
      const balanceId = 'a2197290-534d-43e1-8e8f-6d792db350ed'

      prismaService.balances.findUnique
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce({
          id: balanceId
        })

      const result = await balanceService.remove(
        balanceId,
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual({
        message: 'Saldo excluído com sucesso!',
        balanceId: result.balanceId,
      })
    })

    it('should be return BadRequestException if balance contains payments', async () => {
      const balanceId = 'a2197290-534d-43e1-8e8f-6d792db350ed'

      prismaService.balances.findUnique
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)

      const result = balanceService.remove(
        balanceId,
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      await expect(result).rejects.toThrow(BadRequestException);
    })
  })
});
