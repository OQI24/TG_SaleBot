/**
 * Возвращает случайный стикер из массива
 * @param stickers массив ID стикеров
 * @returns случайный ID стикера или null, если массив пуст
 */
export const getRandomSticker = (stickers: string[]): string | null => {
  const validStickers = stickers.filter(id => id.length > 0);
    
  if (validStickers.length === 0) {
    return null;
  }

  return validStickers[Math.floor(Math.random() * validStickers.length)];
}; 