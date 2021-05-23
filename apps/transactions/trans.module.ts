import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { config } from 'src/config';
import { SnakeNamingStrategy } from 'libs/db-utils/snakeNamingStrategy';
import { AccountEntity, TransactionEntity, TransactionLogEntity } from './entities';
import { TransController } from './trans.controller';
import { TransService } from './trans.service';

const entities = [AccountEntity, TransactionEntity, TransactionLogEntity];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      namingStrategy: new SnakeNamingStrategy(),
      type: 'postgres',
      url: config.PG_URI + '/transactions',
      synchronize: true,
      entities,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [TransController],
  providers: [TransService],
})
export class TransactionsModule {
  constructor(private readonly connection: Connection) {}
}
