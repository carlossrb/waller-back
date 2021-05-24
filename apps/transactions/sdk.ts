import { createHttpClient } from '../../libs/http-client';
import { TransController } from './trans.controller';

type Config = {
  url: string;
};

export const createSdk = (config: Config) => {
  const http = createHttpClient({
    type: 'waller-back',
    baseURL: config.url,
  });

  const getAccountBalance: TransController['getAccountBalance'] = async (id) => {
    return http.get(id);
  };

  const makeDeposit: TransController['deposit'] = async (id, body) => {
    return http.post(`${id}/deposit`, body);
  };

  const makePayment: TransController['payment'] = async (id, body) => {
    return http.post(`${id}/payment`, body);
  };

  const makeWithdrawal: TransController['withdrawal'] = async (id, body) => {
    return http.post(`${id}/withdrawal`, body);
  };

  return {
    getAccountBalance,
    makeDeposit,
    makePayment,
    makeWithdrawal,
  };
};

export type TransSdk = ReturnType<typeof createSdk>;
