import * as Router from 'koa-router';
import Ping from './mockdb';

const router = new Router();

// parseia e valida os dados do ping
const parseAndValidatePingData = (data) => {
  const { author, text } = data;
  const textWords = text.split(' ');

  let errors = [];
  let hashtags = [];
  let mentions = [];
  let wordCounter = textWords.length;

  textWords.filter(word => word.length > 0)
    .forEach(word => {
      if (word[0] == '#') {
        hashtags.push(word);
      } else {
        wordCounter += word.length;
        if (word[0] == '@') {
          mentions.push(word);
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
      reason: errors
    }
  }

  return {
    isValid: true,
    payload: {
      author,
      text,
      hashtags,
      mentions,
    }
  }
}

router.post('/pings', (ctx) => {
  const { isValid, reason, payload } = parseAndValidatePingData(ctx.request.body);
  const { broker } = ctx;

  if (!isValid) {
    ctx.status = 400
    ctx.body = {
      errors: reason
    }
    return;
  }

  broker.publish('CREATED_PING', JSON.stringify(payload));
  ctx.body = payload
});

export default router;
