import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { config } from 'src/config';
import { SnakeNamingStrategy } from 'libs/db-utils/snakeNamingStrategy';
import { AccountEntity, TransactionEntity, TransactionLogEntity } from './entities';
import { TransController } from './trans.controller';

const entities = [AccountEntity, TransactionEntity, TransactionLogEntity];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      namingStrategy: new SnakeNamingStrategy(),
      type: 'postgres',
      host: config.PG_URI,
      port: config.PG_PORT,
      username: config.PG_USERNAME,
      password: config.PG_PASSWORD,
      database: config.PG_DATABASE,
      synchronize: true,
      entities,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [TransController],
})
export class TransactionsModule {
  constructor(private readonly connection: Connection) {}
}
