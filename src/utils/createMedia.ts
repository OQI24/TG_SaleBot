import { BotContext, MediaFile } from '../types/botContext';

export const createMedia = (ctx: BotContext) => {
  let mediaFile: MediaFile | undefined;

  if (!ctx.session.media) {
    ctx.session.media = [];
  }

  if (ctx.message?.photo || ctx.message?.video) {
    const type = ctx.message.photo ? 'photo' : 'video';
    const fileId = ctx.message?.photo?.length
      ? ctx.message.photo[ctx.message.photo.length - 1].file_id
      : ctx.message.video?.file_id;

    if (fileId) {
      mediaFile = { fileId, type };

    }
  }

  return mediaFile && ctx.session.media.push(mediaFile);
};