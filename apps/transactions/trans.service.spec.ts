/// <reference types="@types/jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransService } from './trans.service';
import { AccountEntity, Operation, TransactionEntity, TransactionLogEntity } from './entities';
import { mockAccount, mockTransactions } from './mocks';

describe('TransService', () => {
  let service: TransService;
  let repository: Repository<TransactionEntity>;
  let accountRepository: Repository<AccountEntity>;
  let logRepo: Repository<TransactionLogEntity>;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2021-05-25').getTime());

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(AccountEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(TransactionLogEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(TransService);
    repository = module.get(getRepositoryToken(TransactionEntity));
    accountRepository = module.get(getRepositoryToken(AccountEntity));
    logRepo = module.get(getRepositoryToken(TransactionLogEntity));
  });

  afterEach(() => {
    //Back to reality...
    jest.useRealTimers();
  });

  it('should get transaction balance with correct values', async () => {
    const findOneSpy = jest.spyOn(accountRepository, 'findOne').mockResolvedValue(mockAccount() as any);
    const updateSpy = jest.spyOn(accountRepository, 'update');
    await service.getBalance('32');

    expect(findOneSpy).toBeCalledWith({ relations: ['transactions'], where: { id: '32' } });
    expect(updateSpy).toBeCalledWith(32, {
      accountTotal: 5000.5,
      accountTotalNoYieldRate: 5000,
      totalWithdrawal: 0,
      yields: 0.5,
    });
  });

  it('makeWithdrawal', async () => {
    const findOneSpy = jest.spyOn(accountRepository, 'findOne').mockResolvedValue(mockAccount() as any);
    const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(mockTransactions() as any);
    await service.makeWithdrawal('32', '100,0');

    expect(findOneSpy).toBeCalledWith('32');
    expect(saveSpy).toHaveBeenNthCalledWith(1, {
      account: mockAccount(),
      amount: 100.0,
      operationDate: '05-24-2021',
      status: Operation.WITHDRAW,
      yieldRate: 0.003,
    });
  });

  it('makeDeposit', async () => {
    const findOneSpy = jest.spyOn(accountRepository, 'findOne').mockResolvedValue(mockAccount() as any);
    const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(mockTransactions() as any);
    await service.makeDeposit('32', '100,0');

    expect(findOneSpy).toBeCalledWith('32');
    expect(saveSpy).toHaveBeenNthCalledWith(1, {
      account: mockAccount(),
      amount: parseFloat('100,0'.replace(',', '.')),
      operationDate: '05-24-2021',
      status: Operation.DEPOSIT,
      yieldRate: 0.003,
    });
  });

  it('makePayment', async () => {
    const findOneSpy = jest.spyOn(accountRepository, 'findOne').mockResolvedValue(mockAccount() as any);
    const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(mockTransactions() as any);
    await service.makePayment('32', '123456', '100,0');

    expect(findOneSpy).toBeCalledWith('32');
    expect(saveSpy).toHaveBeenNthCalledWith(1, {
      account: mockAccount(),
      amount: parseFloat('100,0'.replace(',', '.')),
      operationDate: '05-25-2021',
      status: Operation.PAYMENT,
      yieldRate: 0.003,
      destinationAccount: '123456',
    });
  });
});
