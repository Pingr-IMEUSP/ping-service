import { Context } from 'koa';
import { Ping, PingInterface } from './db/mockdb';

interface PingParams {
  author: string;
  text: string;
}

interface ValidationInterface {
  isValid: boolean;
  reason?: string[];
  payload?: PingInterface;
}

export default class PingController {
  static create(ctx: Context): void {
    const { isValid, reason, payload } = PingController.parseAndValidatePingData(ctx.request.body);
    const { broker } = ctx;

    if (!isValid) {
      ctx.status = 400;
      ctx.body = {
        errors: reason,
      };
      return;
    }

    if (payload && payload.hashtags.length > 0) {
      broker.publish('PING_CREATED_WITH_KEYWORDS', JSON.stringify(payload));
    }

    // Emissão do evento
    broker.publish('PING_CREATED', JSON.stringify(payload));
    ctx.body = payload;
  }

  // parseia e valida os dados do ping
  private static parseAndValidatePingData(data: PingParams): ValidationInterface {
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
  }
}
