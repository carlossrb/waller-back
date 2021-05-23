import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity, TransactionLogEntity, AccountEntity } from './entities';
import { TransService } from './trans.service';

@Controller()
export class TransController {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transRepo: Repository<TransactionEntity>,

    @InjectRepository(AccountEntity)
    private readonly accountRepo: Repository<AccountEntity>,

    @InjectRepository(TransactionLogEntity)
    private readonly logRepo: Repository<TransactionLogEntity>,

    private readonly transService: TransService
  ) {}

  @Get(':id')
  async getAccountBalance(@Param('id') id: string): Promise<AccountEntity> {
    const acc = await this.transService.getBalance(id);
    if (!acc) {
      throw new NotFoundException('Transaction not found');
    }
    return acc;
  }
}
