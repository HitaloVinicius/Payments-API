import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { JwtService } from '@nestjs/jwt';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

describe('PaymentController', () => {
  let paymentController: PaymentController;

  const mockPaymentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [JwtService, { provide: PaymentService, useValue: mockPaymentService }],
    }).compile();

    paymentController = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(paymentController).toBeDefined();
  });

  it('should call create service', async () => {
    const paymentDto: CreatePaymentDto = {
      name: 'payment 1',
      value: 3000,
      description: 'description 1',
      balanceId: 'a2197290-534d-43e1-8e8f-6d792db350ed'
    };
    const req = { user: { id: '6752b1b0-2464-47d4-a0d3-c399141e5943' } }
    await paymentController.create(paymentDto, req);
    expect(mockPaymentService.create).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.create).toHaveBeenCalledWith(paymentDto, req.user.id);
  });

  it('should call findAll service', async () => {
    const req = { user: { id: '6752b1b0-2464-47d4-a0d3-c399141e5943' } }
    await paymentController.findAll(req);
    expect(mockPaymentService.findAll).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.findAll).toHaveBeenCalledWith(req.user.id);
  });

  it('should call findOne service', async () => {
    const req = { user: { id: '6752b1b0-2464-47d4-a0d3-c399141e5943' } }
    const paymentId = '5585cb55-a94f-4bd3-aafe-7fe65f6869b7'
    await paymentController.findOne({ id: paymentId }, req);
    expect(mockPaymentService.findOne).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.findOne).toHaveBeenCalledWith(paymentId, req.user.id);
  });

  it('should call update service', async () => {
    const req = { user: { id: '6752b1b0-2464-47d4-a0d3-c399141e5943' } }
    const paymentId = '5585cb55-a94f-4bd3-aafe-7fe65f6869b7'
    const paymentDto: UpdatePaymentDto = {
      name: 'payment 1',
      description: 'description 1'
    };
    await paymentController.update({ id: paymentId }, paymentDto, req);
    expect(mockPaymentService.update).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.update).toHaveBeenCalledWith(paymentId, paymentDto, req.user.id);
  });

  it('should call remove service', async () => {
    const req = { user: { id: '6752b1b0-2464-47d4-a0d3-c399141e5943' } }
    const paymentId = '5585cb55-a94f-4bd3-aafe-7fe65f6869b7'
    await paymentController.remove({ id: paymentId }, req);
    expect(mockPaymentService.remove).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.remove).toHaveBeenCalledWith(paymentId, req.user.id);
  });
});
