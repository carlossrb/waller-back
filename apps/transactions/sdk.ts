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

  const getAccountBalance: TransController['findOne'] = (params) => {
    console.log('CHEGOU AQUI CARAIO', params);
    return http.get('', params);
  };

  return {
    getAccountBalance,
  };
};

export type TransSdk = ReturnType<typeof createSdk>;
