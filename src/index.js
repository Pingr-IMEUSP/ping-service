require('dotenv').config();

import * as logger from 'koa-logger';

import { app } from './app';
import { stan } from './stan';

const port = process.env.PORT || 3000;

async function bootstrap() {
  stan.on('connect', () => {
    console.log('- Broker connected');
    app.use(logger());

    app.context.broker = stan;

    app.listen(port, () => console.log('\n\n=== Server Running! ===\n\n'));
  });
}

bootstrap().catch(console.dir);
