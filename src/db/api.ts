import BotContext from '../types/botContext';
import db from './init_db';

type Ad = {
    messageId: string;
    text: string;
    link: string;
    createdAt?: string;
}

export const createAd = async (ctx: BotContext, { messageId, text, link }: Ad) => {
  try {
    const userId = ctx.from?.id;

    if (!userId) {
      throw new Error('Не удалось получить ID пользователя.');
    }

    // Получаем текущие данные пользователя
    const userRef = db.ref(`users/${String(userId)}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val();

    if (!userData) {
      throw new Error('Пользователь не найден в базе данных.');
    }
        
    const adsCount = (userData.adsCount || 0) + 1;
    await userRef.update({
      adsCount,
      [`ads/${messageId}`]: {
        messageId,
        text,
        link,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Ошибка создания объявления в базе данных', error);
  }
};

export const getUserCounts = async (ctx: BotContext) => {
  const userId = ctx.from?.id;
  if (!userId) {
    throw new Error('Не удалось получить ID пользователя.');
  }

  const userRef = db.ref(`users/${String(userId)}`);
  const snapshot = await userRef.once('value');
  const userData = snapshot.val();

  return [userData.adsCount, userData.adsLimit];
};

export const getUserAds = async (ctx: BotContext) => {
  const userId = ctx.from?.id;
  if (!userId) {
    throw new Error('Не удалось получить ID пользователя.');
  }

  const userRef = db.ref(`users/${String(userId)}`);
  const snapshot = await userRef.once('value');
  const userData = snapshot.val();

  return userData.ads;
};

export const deleteAd = async (ctx: BotContext, messageId: string) => {
  const userId = ctx.from?.id;
  if (!userId) {
    throw new Error('Не удалось получить ID пользователя.');
  }

  const userRef = db.ref(`users/${String(userId)}`);
  const snapshot = await userRef.once('value');
  const userData = snapshot.val();

  if (!userData) {
    throw new Error('Пользователь не найден в базе данных.');
  }

  const ads = userData.ads;
  if (!ads?.[messageId]) {
    throw new Error('Объявление не найдено в базе данных.');
  }

  await userRef.child(`ads/${messageId}`).remove();

  const newAdsCount = userData.adsCount - 1;
  await userRef.update({ adsCount: newAdsCount });

  return true;
};

export const updateUserLimit = async (ctx: BotContext, limit: number) => {
  const userId = ctx.from?.id;
  if (!userId) {
    throw new Error('Не удалось получить ID пользователя.');
  }

  const userRef = db.ref(`users/${String(userId)}`);
  await userRef.update({ adsLimit: limit });
};
