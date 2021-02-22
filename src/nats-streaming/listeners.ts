import { Message } from 'node-nats-streaming';
import { Ping, User, PingInterface, UserInterface } from '../db/mockdb';

import { stan } from './stan';

export function setupListeners(): void {
  const replayAllOpts = stan.subscriptionOptions().setDeliverAllAvailable();

  const createdPing = stan.subscribe('PING_CREATED', replayAllOpts);
  const createdUser = stan.subscribe('USER_CREATED', replayAllOpts);

  //João Corno
  createdPing.on(
    'message',
    async (msg: Message): Promise<void> => {
      const ping: PingInterface = JSON.parse(msg.getData() as string);

      await Ping.all.push(ping);
      console.log('[PING_CREATED]:', ping);
    },
  );

  //Wander Corno
  createdUser.on(
    'message',
    async (msg: Message): Promise<void> => {
      const user: UserInterface = JSON.parse(msg.getData() as string);

      await User.all.push(user);
      console.log('[USER_CREATED]:', user);
    },
  );
}
