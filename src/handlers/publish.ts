import 'dotenv/config';
import { BotContext } from '../types/botContext';
import { generateAdText } from '../utils/generateAdText';
import { getRandomSticker } from '../utils/getRandomSticker';
import { CONFIRMATION_STICKERS } from '../constants/stickers';
import { InputMediaPhoto, InputMediaVideo, Message } from 'grammy/types';
import { createAd } from '../db/api';
import { removeKeyboard } from '../utils/sendReply';

export const publishOffer = async (ctx: BotContext) => {
  const channelId = process.env.PUBLISH_CHANNEL_ID;
  let message: Message | Message[];

  if (!channelId) {
    throw new Error('PUBLISH_CHANNEL_ID not set in environment variables');
  }

  const adText = generateAdText({
    ...ctx.session,
    username: ctx.from?.username || ''
  });

  if (ctx.session.media?.length) {
    // Формируем группу медиа
    const mediaGroup: (InputMediaPhoto | InputMediaVideo)[] = ctx.session.media.map((file, index) => ({
      type: file.type,
      media: file.fileId,
      caption: index === 0 ? adText : '',
      parse_mode: 'HTML'
    }));

    // Публикуем медиагруппу в канал
    message = await ctx.api.sendMediaGroup(channelId, mediaGroup);
  } else {
    // Если нет медиа, публикуем только текст
    message = await ctx.api.sendMessage(channelId, adText, { parse_mode: 'HTML' });
  }

  const msgId = Array.isArray(message) ? message[0]?.message_id : message?.message_id;
  const messageLink = `https://t.me/c/${channelId.replace(/^-100/, '')}/${msgId}`;

  await removeKeyboard(ctx, `<a href="${messageLink}">Объявление</a> успешно опубликовано! 🎉`);

  const stickerId = getRandomSticker(CONFIRMATION_STICKERS);
  if (stickerId) {
    await ctx.replyWithSticker(stickerId);
  }

  await createAd(ctx, { messageId: String(msgId), text: adText, link: messageLink });
};
