// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import * as logger from 'koa-logger';

import { app } from './app';
import { stan } from './stan';
import { setupListeners } from './listeners';

const port = process.env.PORT || 3000;

async function bootstrap() {
  stan.on('connect', () => {
    console.log('- Broker connected');
    app.use(logger());

    app.context.broker = stan;
    setupListeners();

    app.listen(port, () => console.log('\n\n=== Server Running! ===\n\n'));
  });
}

bootstrap().catch(console.dir);
