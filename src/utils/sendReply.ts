import BotContext from '../types/botContext';

export const sendReply = async (ctx: BotContext, msg: string, buttons?: string[]) => {
  const reply_markup = buttons ? {
    keyboard: buttons.map(text => [{ text }]),
    resize_keyboard: true,
    one_time_keyboard: true,
  } : undefined;
  
  await ctx.reply(msg, {reply_markup});
};

// Функция для удаления клавиатуры
export const removeKeyboard = async (ctx: BotContext, msg?: string) => {
  await ctx.reply(msg || '...', {
    reply_markup: {
      remove_keyboard: true, 
    },
    parse_mode: 'HTML'
  });
};