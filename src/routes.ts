import * as Router from 'koa-router';
import { Context } from 'koa';
import Ping from './mockdb';

interface PingParams {
  author: string;
  text: string;
}

const router = new Router();

// parseia e valida os dados do ping
const parseAndValidatePingData = (data: PingParams) => {
  const { author, text } = data;
  const textWords = text.split(' ');

  const errors = [];
  const hashtags: string[] = [];
  const mentions: string[] = [];
  let wordCounter = textWords.length;

  textWords
    .filter((word: string) => word.length > 0)
    .forEach((word: string) => {
      if (word[0] == '#') {
        hashtags.push(word);
      } else {
        wordCounter += word.length;
        if (word[0] == '@') {
          mentions.push(word.replace(/\W/g, ''));
        }
      }
    });

  if (wordCounter > 140) {
    errors.push('Ping exceeded 140 characters');
  }

  if (hashtags.length > 10) {
    errors.push('Ping exceeded 10 hashtags');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      reason: errors,
    };
  }

  return {
    isValid: true,
    payload: {
      id: ++Ping.count,
      author,
      text,
      hashtags,
      mentions,
    },
  };
};

router.post('/pings', (ctx: Context) => {
  const { isValid, reason, payload } = parseAndValidatePingData(ctx.request.body);
  const { broker } = ctx;

  if (!isValid) {
    ctx.status = 400;
    ctx.body = {
      errors: reason,
    };
    return;
  }

  // Emissão do evento
  broker.publish('CREATED_PING', JSON.stringify(payload));
  ctx.body = payload;
});

export default router;
