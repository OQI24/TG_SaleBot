import { SessionData } from '../types/botContext';

export const generateAdText = (session: SessionData & { username?: string }): string => {
  const { title, description, city, shippingServices, price, phone, username, offerType, tags } = session;
  const offerTag = offerType?.toLocaleLowerCase() as string;
  const allTags = [offerTag, ...(tags || [])].map(tag => `#${tag}`);

  return `<b>${title}</b>\n` +
    `${allTags.join(' ')}\n` +
    `\n💰 ${price + (price !== 'Бесплатно' ? ' ₽' : '')}\n` +
    `${shippingServices?.length && '🚚 ' + shippingServices.join(', ')}\n` +
    `\n📍 <code>${city}</code>\n` +
    `👤 @${username}\n` +
    `${phone ? `📞 ${phone}\n` : ''}` +
    `\n📝 ${description}`;
}; 