import { BotContext } from '../types/botContext';
import { generateAdText } from '../utils/generateAdText';
import { InputMediaPhoto, InputMediaVideo } from 'grammy/types';
import { sendReply } from '../utils/sendReply';

export const showPreview = async (ctx: BotContext) => {
  const previewText = generateAdText({
    ...ctx.session,
    username: ctx.from?.username || ''
  });

  if (ctx.session?.media?.length) {
    const mediaGroup: (InputMediaPhoto | InputMediaVideo)[] = ctx.session.media.map((file, index) => ({
      type: file.type,
      media: file.fileId,
      caption: index === 0 ? previewText : '',
      parse_mode: 'HTML'
    }));

    await ctx.replyWithMediaGroup(mediaGroup); // Отправляем медиагруппу
  } else {
    await ctx.reply(previewText, { parse_mode: 'HTML' }); // Отправляем только текст
  }
  
  await sendReply(ctx, 'Проверьте объявление и подтвердите размещение', ['Разместить', 'Создать заново']);
};
