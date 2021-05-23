import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { Ctx } from '../../context';
import { Account } from './transactions.types';

@Resolver()
export class TransResolver {
  @Query(() => Account)
  async getAccountBalance(@Args('id') id: string, @Context() ctx: Ctx): Promise<Account> {
    const acc = await ctx.dataSources.trans.getAccountBalance(id);
    return acc;
  }
}
