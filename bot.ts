import 'dotenv/config'; 
import { Bot as GBot, session } from 'grammy';
import { handleStart } from './src/handlers/start.js';
import { createOffer, deleteOffer, getAdsList } from './src/handlers/commands.js';
import { handleText } from './src/handlers/handleText.js';
import type BotContext from './src/types/botContext.js';

export const bot = new GBot<BotContext>(process.env.BOT_TOKEN as string);

bot.use(
  session({
    initial: () => ({}),
  })
);

// Автоматически отвечаем на все callback queries
bot.use(async (ctx, next) => {
  await next();
  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }
});

//start
bot.command('start', handleStart);

//commands
bot.command('create', createOffer);
bot.command('delete', deleteOffer);
bot.command('list', getAdsList);
bot.command('limit', getAdsList);

// Обработчик инлайн-кнопок
bot.callbackQuery('create', createOffer);

// Обработчики сообщений
bot.on('message:text', handleText);
bot.on(['message:photo', 'message:video'], handleText);

bot.start();
