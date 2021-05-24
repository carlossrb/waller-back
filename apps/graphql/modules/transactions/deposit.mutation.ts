import { Resolver, Args, Context, InputType, Field, Mutation, ObjectType, ID } from '@nestjs/graphql';
import { Ctx } from '../../context';
import { Account } from './transactions.types';

@InputType()
class DepositInput {
  @Field(() => ID)
  id!: string;

  @Field()
  amount!: string;
}

@ObjectType()
class DepositPayload {
  @Field({ nullable: true })
  account?: Account;
}

@Resolver()
export class DepositMutation {
  @Mutation(() => DepositPayload)
  async makeDeposit(@Args('input') input: DepositInput, @Context() ctx: Ctx): Promise<DepositPayload> {
    const account = await ctx.dataSources.trans.makeDeposit(input);

    return { account };
  }
}
