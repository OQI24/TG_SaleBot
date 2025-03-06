import { getUserAds, getUserCounts } from '../db/api';
import { BotContext, Steps, StickerType } from '../types/botContext';
import { removeKeyboard, sendReply, sendSticker } from '../utils/sendReply';
import { deleteAds } from './deleteAds';

export const createOffer = async (ctx: BotContext) => {
  const [adsCount, adsLimit] = await getUserCounts(ctx);
  
  if (adsCount >= adsLimit) {
    await sendReply(ctx, 'Вы достигли лимита объявлений. Расширьте лимит или удалите существующие объявления', ['Расширить лимит']);
    return;
  }
  
  ctx.session = { actionType: 'create' };
  ctx.session.step = Steps.OFFER_TYPE;
  await sendReply(ctx, 'Выберите тип объявления:', ['Продам', 'Куплю']);
};

export const deleteOffer = async (ctx: BotContext) => {
  if (ctx.message?.text?.startsWith('🗑')) {
    await deleteAds(ctx);
    ctx.session = {};
    return;
  }

  if (ctx.message?.text?.startsWith('🥹')) {
    ctx.session = {};
    await sendSticker(ctx, StickerType.GOODBYE);
    await removeKeyboard(ctx, 'Хорошо, если что, я всегда тут! А доступные команды в меню слева \n👇');
    return;
  }

  if (Number(ctx.message?.text) >= 0) {
    ctx.session.deleteAdId = ctx.session.adsIds?.[Number(ctx.message?.text) - 1];
    await sendReply(ctx, 'Подтвердите удаление\n' + ctx.session.links?.[Number(ctx.message?.text) - 1], ['🗑 Да, прочь его!', '🥹 Нет, передумал']);
    return;
  }

  ctx.session = { actionType: 'delete' };
  const links = await getAdsList(ctx);
  await sendReply(ctx, 'Какое удалить?', links.map((_link: string, index: number) => String(index + 1)));
};

export const getAdsList = async (ctx: BotContext) => {
  await removeKeyboard(ctx);
  const ads = await getUserAds(ctx);
  const adsLinks = Object.keys(ads).map((ad: string) => ads[ad].link);
  const adsIds = Object.keys(ads).map((ad: string) => ads[ad].messageId);
  ctx.session.links = adsLinks;
  ctx.session.adsIds = adsIds;
  const adsList = adsLinks.map((link: string, index: number) => `${index + 1}. ${link}`);
  await sendReply(ctx, 'Ваши объявления: \n' + adsList.join('\n'));
  return adsLinks;
};
