import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { JwtService } from '@nestjs/jwt';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

describe('BalanceController', () => {
  let balanceController: BalanceController;

  const mockBalanceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [JwtService, { provide: BalanceService, useValue: mockBalanceService }],
    }).compile();

    balanceController = module.get<BalanceController>(BalanceController);
  });

  it('should be defined', () => {
    expect(balanceController).toBeDefined();
  });

  it('should call create service', async () => {
    const balanceDto: CreateBalanceDto = {
      name: 'balance1',
      value: 3000,
      description: 'description1'
    };
    const req = { user: { id: '6752b1b0-2464-47d4-a0d3-c399141e5943' } }
    await balanceController.create(balanceDto, req);
    expect(mockBalanceService.create).toHaveBeenCalledTimes(1);
    expect(mockBalanceService.create).toHaveBeenCalledWith(balanceDto, req.user.id);
  });

  it('should call findAll service', async () => {
    const req = { user: { id: '6752b1b0-2464-47d4-a0d3-c399141e5943' } }
    await balanceController.findAll(req);
    expect(mockBalanceService.findAll).toHaveBeenCalledTimes(1);
    expect(mockBalanceService.findAll).toHaveBeenCalledWith(req.user.id);
  });

  it('should call findOne service', async () => {
    const req = { user: { id: '6752b1b0-2464-47d4-a0d3-c399141e5943' } }
    const balanceId = 'a2197290-534d-43e1-8e8f-6d792db350ed'
    await balanceController.findOne(balanceId, req);
    expect(mockBalanceService.findOne).toHaveBeenCalledTimes(1);
    expect(mockBalanceService.findOne).toHaveBeenCalledWith(balanceId, req.user.id);
  });

  it('should call update service', async () => {
    const req = { user: { id: '6752b1b0-2464-47d4-a0d3-c399141e5943' } }
    const balanceId = 'a2197290-534d-43e1-8e8f-6d792db350ed'
    const balanceDto: UpdateBalanceDto = {
      name: 'balance1',
      description: 'description1'
    };
    await balanceController.update(balanceId, balanceDto, req);
    expect(mockBalanceService.update).toHaveBeenCalledTimes(1);
    expect(mockBalanceService.update).toHaveBeenCalledWith(balanceId, balanceDto, req.user.id);
  });

  it('should call remove service', async () => {
    const req = { user: { id: '6752b1b0-2464-47d4-a0d3-c399141e5943' } }
    const balanceId = 'a2197290-534d-43e1-8e8f-6d792db350ed'
    await balanceController.remove(balanceId, req);
    expect(mockBalanceService.remove).toHaveBeenCalledTimes(1);
    expect(mockBalanceService.remove).toHaveBeenCalledWith(balanceId, req.user.id);
  });
});