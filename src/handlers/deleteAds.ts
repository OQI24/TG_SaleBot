import 'dotenv/config';
import BotContext from '../types/botContext';
import { deleteAd } from '../db/api';
import { removeKeyboard } from '../utils/sendReply';

export const deleteAds = async (ctx: BotContext) => {
  try {
    if (ctx.session.deleteAdId) {
      await ctx.api.deleteMessage(process.env.PUBLISH_CHANNEL_ID as string, Number(ctx.session.deleteAdId));
      await deleteAd(ctx, ctx.session.deleteAdId as string);
      await removeKeyboard(ctx, 'Объявление удалено!');
    } else {
      await removeKeyboard(ctx, 'Не удалось найти сообщение для удаления.');
    }
  } catch (error) {
    console.error(error);
    await removeKeyboard(ctx, 'Не удалось удалить объявление.');
  }
};