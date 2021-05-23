import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity, TransactionLogEntity } from './entities';

@Controller()
export class TransController {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transRepo: Repository<TransactionEntity>,

    @InjectRepository(TransactionLogEntity)
    private readonly logRepo: Repository<TransactionLogEntity>
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TransactionEntity> {
    console.log('AGORA PASSOU HEHE', id);
    const trans = await this.transRepo.findOne(Number(id));
    if (!trans) {
      throw new NotFoundException('Transaction not found');
    }
    return trans;
  }
}
