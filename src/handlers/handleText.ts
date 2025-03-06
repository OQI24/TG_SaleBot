import { BotContext } from '../types/botContext';
import { deleteOffer } from './commands';
import { createOfferProcess } from './createOfferProcess';

export const handleText = async (ctx: BotContext) => {
  if (ctx.session.actionType === 'delete') {
    await deleteOffer(ctx);
    return;
  }
  
  await createOfferProcess(ctx);

};
