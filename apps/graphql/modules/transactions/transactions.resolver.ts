import { Resolver, Query, Args, Int, Context, Root, ResolveField, InputType, Field, ID } from '@nestjs/graphql';
import { Ctx } from '../../context';
import { Transaction } from './transactions.types';

@Resolver()
export class TransResolver {
  @Query(() => Transaction)
  async transactions(@Args('id') id: string, @Context() ctx: Ctx): Promise<{ trans: Transaction }> {
    const trans = await ctx.dataSources.trans.getAccountBalance(id);

    return trans;
  }
}
