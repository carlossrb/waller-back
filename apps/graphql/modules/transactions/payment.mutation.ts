import { Resolver, Args, Context, InputType, Field, Mutation, ObjectType, ID } from '@nestjs/graphql';
import { Ctx } from '../../context';
import { Account } from './transactions.types';

@InputType()
class PaymentInput {
  @Field(() => ID)
  id!: string;

  @Field()
  amount!: string;

  @Field()
  target!: string;
}

@ObjectType()
class PaymentPayload {
  @Field({ nullable: true })
  account?: Account;
}

@Resolver()
export class PaymentMutation {
  @Mutation(() => PaymentPayload)
  async makePayment(@Args('input') input: PaymentInput, @Context() ctx: Ctx): Promise<PaymentPayload> {
    const account = await ctx.dataSources.trans.makePayment(input);

    return { account };
  }
}
