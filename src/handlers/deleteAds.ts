import 'dotenv/config';
import BotContext, { StickerType } from '../types/botContext';
import { deleteAd } from '../db/api';
import { removeKeyboard, sendSticker } from '../utils/sendReply';

export const deleteAds = async (ctx: BotContext) => {
  const channelId = process.env.PUBLISH_CHANNEL_ID as string;
  try {
    if (ctx.session.deleteAdId) {
      await ctx.api.deleteMessage(channelId, Number(ctx.session.deleteAdId));
      await deleteAd(ctx, ctx.session.deleteAdId as string);
      await sendSticker(ctx, StickerType.DELETE);
      await removeKeyboard(ctx, 'Объявление удалено!');
    } else {
      await removeKeyboard(ctx, 'Не удалось найти сообщение для удаления.');
    }
  } catch (error) {
    console.error(error);
    await removeKeyboard(ctx, 'Не удалось удалить объявление.');
  }
};