import { Message } from 'node-nats-streaming';
import Ping, { PingInterface } from '../db/mockdb';

import { stan } from './stan';

export function setupListeners(): void {
  const replayAllOpts = stan.subscriptionOptions().setDeliverAllAvailable();

  const createdPing = stan.subscribe('PING_CREATED', replayAllOpts);
  //João Corno
  createdPing.on(
    'message',
    async (msg: Message): Promise<void> => {
      const ping: PingInterface = JSON.parse(msg.getData() as string);

      await Ping.all.push(ping);
      console.log('[PING_CREATED]:', ping);
      //Wander Corno
    },
  );
}
