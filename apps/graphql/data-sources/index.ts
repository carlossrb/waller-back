import { Transactions } from './transactions';

export const createDataSources = () => {
  return {
    trans: new Transactions(),
  };
};

export type DataSources = ReturnType<typeof createDataSources>;
