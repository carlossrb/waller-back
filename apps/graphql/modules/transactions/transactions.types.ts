import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum Operation {
  DEPOSIT = 'DEPOSIT',
  PAYMENT = 'PAYMENT',
  WITHDRAW = 'WITHDRAW',
}

registerEnumType(Operation, {
  name: 'Operation',
});

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id!: string;

  @Field(() => Operation)
  status!: Operation;

  @Field()
  userName!: string;

  @Field()
  userEmail!: string;

  @Field()
  accountNumber: string;

  @Field()
  amount!: number;

  @Field()
  taxes!: number;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field()
  createdAt!: Date;

  @Field()
  operationDate!: string;
}
