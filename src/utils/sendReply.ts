import BotContext from '../types/botContext';
import { getRandomSticker } from './getRandomSticker';
import { STICKERS } from '../constants/stickers';

export const sendReply = async (ctx: BotContext, msg: string, buttons?: string[]) => {
  const reply_markup = buttons ? {
    keyboard: buttons.map(text => [{ text }]),
    resize_keyboard: true,
    one_time_keyboard: true,
  } : undefined;
  
  await ctx.reply(msg, {reply_markup});
};

export const removeKeyboard = async (ctx: BotContext, msg?: string) => {
  await ctx.reply(msg || '...', {
    reply_markup: {
      remove_keyboard: true, 
    },
    parse_mode: 'HTML'
  });
};

export const sendSticker = async (ctx: BotContext, stickerType: keyof typeof STICKERS) => {
  const stickerId = getRandomSticker(STICKERS[stickerType]);

  if (stickerId) {
    try {
      await ctx.replyWithSticker(stickerId);
    } catch (error) {
      console.error(error);
    }
  }
};
