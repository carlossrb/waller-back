import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { AccountEntity } from './entities';
import { TransService } from './trans.service';

@Controller()
export class TransController {
  constructor(private readonly transService: TransService) {}

  @Get(':id')
  async getAccountBalance(@Param('id') id: string): Promise<AccountEntity> {
    const acc = await this.transService.getBalance(id);
    if (!acc) {
      throw new NotFoundException('Transaction not found');
    }
    return acc;
  }

  @Post(':id/payment')
  async payment(
    @Param('id') id: string,
    @Body() paymentData: { target: string; amount: string }
  ): Promise<AccountEntity> {
    const { target, amount } = paymentData;
    const acc = await this.transService.makePayment(id, target, amount);
    if (!acc) {
      throw new NotFoundException('Payment not completed');
    }
    return acc;
  }

  @Post(':id/deposit')
  async deposit(@Param('id') id: string, @Body() depositData: { amount: string }): Promise<AccountEntity> {
    const { amount } = depositData;
    const acc = await this.transService.makeDeposit(id, amount);
    if (!acc) {
      throw new NotFoundException('Deposit not completed');
    }
    return acc;
  }

  @Post(':id/withdrawal')
  async withdrawal(@Param('id') id: string, @Body() withdrawalData: { amount: string }): Promise<AccountEntity> {
    const { amount } = withdrawalData;
    const acc = await this.transService.makeWithdrawal(id, amount);
    if (!acc) {
      throw new NotFoundException('Withdrawal not completed');
    }
    return acc;
  }
}
