import 'dotenv/config';
import { InlineKeyboard } from 'grammy';
import { startMsg } from '../constants/msgs';
import { handleStartUser } from '../db/handeleUsers';
import BotContext, { StickerType } from '../types/botContext';
import { sendSticker } from '../utils/sendReply';

export const handleStart = async (ctx: BotContext) => {
  const userType = await handleStartUser(ctx);

  if (!userType) {
    return;
  }

  const keyboard = new InlineKeyboard()
    .text('Создать объявление', 'create');

  await sendSticker(ctx, StickerType.START);

  await ctx.reply(startMsg(ctx.from?.first_name || '', userType), {
    reply_markup: keyboard,
  });
};
