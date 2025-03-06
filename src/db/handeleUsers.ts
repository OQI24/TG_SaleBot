import { User } from 'grammy/types';
import BotContext from '../types/botContext';
import db from './firebase';

export type UserType = 'old' | 'new' | null;

export const handleStartUser = async (ctx: BotContext) => {
  let userType: UserType = null;
  const {id: userId, username, first_name, last_name} = ctx.from as User;

  if (userId && username) {
    const userRef = db.ref(`users/${String(userId)}`);

    // Проверяем, существует ли пользователь
    const snapshot = await userRef.once('value');
    const userData = snapshot.val();

    if (!userData) {
      userType = 'new';
      // Создаем нового пользователя
      await userRef.set({
        username,
        first_name,
        last_name,
        adsCount: 0,
        adsLimit: 5,
        createdAt: new Date().toISOString(),
        ads: {},
      });
    } else {
      userType = 'old';
    }
  } else {
    await ctx.reply('Не удалось получить данные пользователя.');
  }

  return userType;
};