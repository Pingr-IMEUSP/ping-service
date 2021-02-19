import { Message } from 'node-nats-streaming';
import Ping, { PingInterface } from '../db/mockdb';

import { stan } from './stan';

export function setupListeners(): void {
  const replayAllOpts = stan.subscriptionOptions().setDeliverAllAvailable();

  const createdPing = stan.subscribe('CREATED_PING', replayAllOpts);

  createdPing.on(
    'message',
    async (msg: Message): Promise<void> => {
      const ping: PingInterface = JSON.parse(msg.getData() as string);

      console.log('ping', ping);

      // Ping.all.push(ping);
    },
  );
}
