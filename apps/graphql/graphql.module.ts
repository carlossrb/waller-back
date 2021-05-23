import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as fg from 'fast-glob';
import { createDataSources } from './data-sources';

const providers = fg
  .sync(__dirname + '/modules/**/*.{resolver,mutation}.{js,ts}')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  .flatMap((path) => Object.values(require(path))) as any;

@Module({
  providers,
  imports: [
    GraphQLModule.forRoot({
      path: '/graphql',
      autoSchemaFile: 'schema.gql',
      dataSources: createDataSources,
      // add de context para autenticação nas queries
    }),
  ],
})
export class RocaGraphQLModule {}
