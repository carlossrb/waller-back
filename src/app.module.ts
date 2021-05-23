import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import * as glob from 'fast-glob';

const BASE_PATH = __dirname + '/..';

//import dinâmico dos modules em apps
const modules = glob.sync(BASE_PATH + '/apps/*/*.module.js').map((path) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = Object.entries(require(path)).reduce<any>((acc, [key, value]) => {
    if (key.slice(-6, 100) === 'Module') {
      return value;
    }
  }, null);

  if (!mod) {
    throw new Error(`Module for app ${path} not found. Make sure there is a module with sufix 'Module' being exported`);
  }

  return {
    path: '/' + path.replace(BASE_PATH, '').split('/')[2],
    module: mod,
  };
});

@Module({
  imports: [RouterModule.forRoutes(modules), ...modules.map((m) => m.module)],
})
export class AppModule {}
