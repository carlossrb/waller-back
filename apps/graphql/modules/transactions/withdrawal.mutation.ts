import { Resolver, Args, Context, InputType, Field, Mutation, ObjectType, ID } from '@nestjs/graphql';
import { Ctx } from '../../context';
import { Account } from './transactions.types';

@InputType()
class WithdrawalInput {
  @Field(() => ID)
  id!: string;

  @Field()
  amount!: string;
}

@ObjectType()
class WithdrawalPayload {
  @Field({ nullable: true })
  account?: Account;
}

@Resolver()
export class WithdrawalMutation {
  @Mutation(() => WithdrawalPayload)
  async makeWithdrawal(@Args('input') input: WithdrawalInput, @Context() ctx: Ctx): Promise<WithdrawalPayload> {
    const account = await ctx.dataSources.trans.makeWithdrawal(input);

    return { account };
  }
}
