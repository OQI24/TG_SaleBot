import 'dotenv/config';
import { BotContext } from '../types/botContext';
import { deleteOffer } from './commands';
import { createOfferProcess } from './createOfferProcess';

export const handleText = async (ctx: BotContext) => {
  const chatId = ctx.message?.chat.id;
  const PUBLISH_CHANNEL_ID = process.env.PUBLISH_CHANNEL_ID; //1443629975?

  if (chatId !== PUBLISH_CHANNEL_ID) {
    // return;
  }

  if (ctx.session.actionType === 'delete') {
    await deleteOffer(ctx);
    return;
  }
  
  await createOfferProcess(ctx);

};
