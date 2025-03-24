import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from '../../database/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BadRequestException, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';

describe('PaymentService', () => {
  let paymentService: PaymentService;

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
        id: '3c8c395e-1cd7-45d2-b9bd-4050bf715940',
        name: 'Saldo 2',
        description: 'Saldo 2 description',
        initial_value: 2000,
        remaining_value: 1000,
        user_id: '257849a8-0829-4384-a131-fc5645ba7dc9'
      },
    ],
    payments: [
      {
        id: "5585cb55-a94f-4bd3-aafe-7fe65f6869b7",
        name: "pagamento 1",
        description: "Pagamento referente a ...",
        value: 150,
        user_id: "6752b1b0-2464-47d4-a0d3-c399141e5943",
        balance_id: "a2197290-534d-43e1-8e8f-6d792db350ed"
      },
      {
        id: "3e190ce2-b134-411e-863e-9d39864f3c37",
        name: "pagamento 2",
        description: null,
        value: 200,
        user_id: "6752b1b0-2464-47d4-a0d3-c399141e5943",
        balance_id: "a2197290-534d-43e1-8e8f-6d792db350ed"
      },
      {
        id: "29b13953-8f00-4aff-b82d-b3cdd51ff19f",
        name: "pagamento 2",
        description: null,
        value: 200,
        user_id: "257849a8-0829-4384-a131-fc5645ba7dc9",
        balance_id: "3c8c395e-1cd7-45d2-b9bd-4050bf715940"
      }
    ]
  }

  const mockPrismaService = {
    payments: {
      create: jest.fn().mockReturnValue({ id: '4d36ef3e-226d-4c18-8d9f-f288083387c5' }),
      findMany: jest.fn().mockImplementation(({ where }) =>
        mockDb.payments.filter((element) =>
          (element.user_id === where.user_id))),
      findUnique: jest.fn().mockImplementation(({ where }) =>
        mockDb.payments.find((element) => (element.id === where.id))),
      update: jest.fn().mockImplementation(({ where }) => { return { paymentId: where.id } }
      ),
      delete: jest.fn()
    },
    balances: {
      findUnique: jest.fn().mockImplementation(({ where }) =>
        mockDb.balances.find((element) =>
          (element.id === where.id && element.user_id === where.user_id)))
    },

    $transaction: jest.fn((callback) => callback({
      payments: {
        create: jest.fn().mockReturnValue('81abbb33-d9c3-4f5b-a5aa-bd187e034e22'),
        delete: jest.fn()
      },
      balances: {
        update: jest.fn()
      }
    }))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, {
        provide: PrismaService,
        useValue: mockPrismaService
      }],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(paymentService).toBeDefined();
  });

  describe('createPayment', () => {
    it('should be create payment with valid user', async () => {
      const data: CreatePaymentDto = {
        name: 'Pagamento 1',
        value: 200,
        balanceId: 'a2197290-534d-43e1-8e8f-6d792db350ed'
      }
      const result = await paymentService.create(data, '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual({
        message: 'Pagamento feito com sucesso!',
        paymentId: result.paymentId,
      })
    })

    it('should be not create payment with invalid user', async () => {
      const data: CreatePaymentDto = {
        name: 'Pagamento 1',
        value: 200,
        balanceId: '3c8c395e-1cd7-45d2-b9bd-4050bf715940'
      }
      const result = paymentService.create(data, '6752b1b0-2464-47d4-a0d3-c399141e5943')
      await expect(result).rejects.toThrow(UnauthorizedException);
    })

    it('should be not create payment with invalid value', async () => {
      const data: CreatePaymentDto = {
        name: 'Pagamento 1',
        value: 5000,
        balanceId: 'a2197290-534d-43e1-8e8f-6d792db350ed'
      }
      const result = paymentService.create(data, '6752b1b0-2464-47d4-a0d3-c399141e5943')
      await expect(result).rejects.toThrow(UnprocessableEntityException);
    })
  })

  describe('findAllPayment', () => {
    it('should be return valid payments', async () => {
      const result = await paymentService.findAll('6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual([{ ...mockDb.payments[0] }, { ...mockDb.payments[1] }])
    })
  })

  describe('findOnePayment', () => {
    it('should be return one valid payment', async () => {
      const result = await paymentService.findOne(
        '5585cb55-a94f-4bd3-aafe-7fe65f6869b7',
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual(mockDb.payments[0])
    })

    it('should be not return payment with invalid user', async () => {
      const result = paymentService.findOne(
        '5585cb55-a94f-4bd3-aafe-7fe65f6869b7',
        '6752b1b0-2464-47d4-a0d3-c359144e5144')
      await expect(result).rejects.toThrow(UnauthorizedException);
    })

    it('should be return NotFoundException wuth invalid payment', async () => {
      const result = paymentService.findOne(
        '0000cb55-a94f-4bd3-aafe-7fe65f680000',
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      await expect(result).rejects.toThrow(NotFoundException);
    })
  })

  describe('updatePayment', () => {
    it('should be return UnauthorizedException with invalid user', async () => {
      const result = paymentService.update(
        '5585cb55-a94f-4bd3-aafe-7fe65f6869b7',
        {
          name: 'name1',
          description: 'description1'
        },
        '6752b1b0-2464-47d4-a0d3-c359144e5144')
      await expect(result).rejects.toThrow(UnauthorizedException);
    })

    it('should be return BadRequestException with invalid body', async () => {
      const result = paymentService.update(
        '5585cb55-a94f-4bd3-aafe-7fe65f6869b7',
        {},
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      await expect(result).rejects.toThrow(BadRequestException);
    })

    it('should be update payment with valid name', async () => {
      const body = { name: "name1" }
      const result = await paymentService.update(
        '5585cb55-a94f-4bd3-aafe-7fe65f6869b7',
        body,
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual({
        message: 'Pagamento Editado com sucesso!',
        paymentId: result.paymentId,
      })
    })

    it('should be update payment with valid description', async () => {
      const body = { description: "description1" }
      const result = await paymentService.update(
        '5585cb55-a94f-4bd3-aafe-7fe65f6869b7',
        body,
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual({
        message: 'Pagamento Editado com sucesso!',
        paymentId: result.paymentId,
      })
    })

    it('should be update payment with valid name and description', async () => {
      const body = { name: "name1", description: "description1" }
      const result = await paymentService.update(
        '5585cb55-a94f-4bd3-aafe-7fe65f6869b7',
        body,
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual({
        message: 'Pagamento Editado com sucesso!',
        paymentId: result.paymentId,
      })
    })
  })

  describe('deletePayment', () => {
    it('should be return UnauthorizedException with invalid user', async () => {
      const result = paymentService.remove(
        '5585cb55-a94f-4bd3-aafe-7fe65f6869b7',
        '6752b1b0-2464-47d4-a0d3-c359144e5144')
      await expect(result).rejects.toThrow(UnauthorizedException);
    })

    it('should be return NotFoundException if payment does not exist', async () => {
      const result = paymentService.remove(
        '0000cb55-a94f-4bd3-aafe-7fe65f680000',
        '6752b1b0-2464-47d4-a0d3-c359144e5144')
      await expect(result).rejects.toThrow(NotFoundException);
    })

    it('should be delete payment', async () => {
      const result = await paymentService.remove(
        '5585cb55-a94f-4bd3-aafe-7fe65f6869b7',
        '6752b1b0-2464-47d4-a0d3-c399141e5943')
      expect(result).toEqual({
        message: 'Pagamento excluído com sucesso!',
        paymentId: result.paymentId,
      })
    })
  })
});