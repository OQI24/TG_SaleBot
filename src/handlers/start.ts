import 'dotenv/config';
import { InlineKeyboard } from 'grammy';
import { startMsg } from '../constants/msgs';
import { START_STICKERS } from '../constants/stickers';
import { getRandomSticker } from '../utils/getRandomSticker';
import { handleStartUser } from '../db/handeleUsers';
import BotContext from '../types/botContext';

export const handleStart = async (ctx: BotContext) => {
  const userType = await handleStartUser(ctx);

  if (!userType) {
    return;
  }

  const keyboard = new InlineKeyboard()
    .text('Создать объявление', 'create');

  const stickerId = getRandomSticker(START_STICKERS);
  if (stickerId) {
    await ctx.replyWithSticker(stickerId);
  }

  await ctx.reply(startMsg(ctx.from?.first_name || '', userType), {
    reply_markup: keyboard,
  });
};
