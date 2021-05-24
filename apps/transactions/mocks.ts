import { Operation } from './entities';

export const mockAccount = () => ({
  id: 32,
  accountNumber: '1265gf',
  accountTotal: 5000.5,
  accountTotalNoYieldRate: 5000,
  createdAt: new Date(),
  operationDate: '05-24-2021',
  totalWithdrawal: 0,
  updatedAt: new Date(),
  userEmail: 'dev@dev.com',
  userName: 'Deverson deverino',
  yields: 0.5,
  transactions: [
    {
      amount: 5000,
      account: {},
      createdAt: new Date(),
      destinationAccount: '156651',
      id: 3,
      operationDate: '05-22-2021',
      status: Operation.DEPOSIT,
      yieldRate: 0.003,
    },
  ],
});

export const mockTransactions = () => ({
  account: mockAccount(),
  amount: 50000,
  createdAt: new Date(),
  destinationAccount: '156651',
  id: 3,
  operationDate: '05-22-2021',
  status: Operation.DEPOSIT,
  yieldRate: 0.003,
});
