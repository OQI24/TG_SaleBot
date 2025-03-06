import { BotContext, SessionData, StickerType } from '../types/botContext';
import { showPreview } from './preview';
import { publishOffer } from './publish';
import { createOffer } from './commands';
import { Steps } from '../types/botContext';
import { removeKeyboard, sendReply, sendSticker } from '../utils/sendReply';
import { createMedia } from '../utils/createMedia';

export const createOfferProcess = async (ctx: BotContext) => {
  const text = ctx.message?.text?.trim() || '';
  const step = ctx.session?.step;
  
  switch (step) {
  case Steps.OFFER_TYPE: {
    const validOfferTypes = ['Продам', 'Куплю'];
      
    if (!validOfferTypes.includes(text)) {
      await sendReply(ctx, 'Пожалуйста, выберите тип объявления (Продам/Куплю)');
      break;
    }
    ctx.session.offerType = text as SessionData['offerType'];
    ctx.session.step = Steps.MEDIA;
    await sendReply(ctx, 'Прикрепите до 10 медиа или нажмите "Пропустить"', ['Пропустить']);
    break;
  }
    
  case Steps.MEDIA: {
    const maxMediaFiles = 10;

    if (!ctx.session.media) {
      ctx.session.media = [];
    }
    if (ctx.message?.text === 'Пропустить' || ctx.message?.text?.startsWith('Подтвердить') || ctx.session.media.length >= maxMediaFiles) {
      ctx.session.step = Steps.TITLE;
      await sendReply(ctx, 'Укажите название объявления\n' + 'Например, "Продам запчасти" или "Куплю машину"');
      break;
    }

    createMedia(ctx);
      
    if (ctx.session.media.length === 1) {
      await sendReply(ctx, 'Нажмите "Подтвердить" или добавьте еще медиа', ['Подтвердить']);
    }
    break;
  }

  case Steps.TITLE: {
    ctx.session.title = text;
    ctx.session.step = Steps.DESCRIPTION;
    await sendReply(ctx, 'Введите текст объявления');
    break;
  }
    
  case Steps.DESCRIPTION: {
    ctx.session.description = text;
    ctx.session.step = Steps.CITY;
    await sendReply(ctx, 'Укажите город (например, "Москва")');
    break;
  }
    
  case Steps.CITY: {
    ctx.session.city = text;
    await sendReply(ctx, 'Стоимость сделки в ₽ (можно интервал через "-")', ['Бесплатно']);
    ctx.session.step = Steps.PRICE;
    break;
  }

  case Steps.PRICE: {
    if (text !== 'Бесплатно') {
      const isValidPrice = /^[\d\s.]*$/.test(text) && /\d/.test(text);

      if (!isValidPrice) {
        await sendReply(ctx, 'Цена должна содержать не меньше одной цифры, допускается использование пробелов и точек. Пожалуйста, введите цену заново или нажмите "Бесплатно":', ['Бесплатно']);
        break;
      }
    }

    ctx.session.price = text;
    await sendReply(ctx, 'Укажите службы доставки через запятую или нажмите "Только самовывоз"', ['Только самовывоз']);
    ctx.session.step = Steps.SHIPPING_SERVICES;
    break;
  }

  case Steps.SHIPPING_SERVICES: {
    ctx.session.shippingServices = text === 'Только самовывоз'
      ? ['Только самовывоз']
      : ctx.message?.text?.split(',').map(s => s.trim());

    ctx.session.step = Steps.PHONE;
    await sendReply(ctx, 'Укажите номер телефона в международном формате (например "+79999999999") или нажмите "Пропустить"', ['Пропустить']);
    break;
  }

  case Steps.PHONE: {
    // Проверка на допустимые символы: маска + и любые цифры
    const isValidPhone = /^\+\d+$/.test(text);
      
    if (!isValidPhone && text !== 'Пропустить') {
      await sendReply(ctx, 'Номер телефона должен начинаться с "+" и содержать только цифры', ['Пропустить']);
      break;
    }

    ctx.session.phone = text === 'Пропустить' ? '' : text;
    ctx.session.step = Steps.TAGS;
    await sendReply(ctx, 'Укажите теги для поиска через запятую \n(например, "расходники, двигатель, тюнинг")', ['Пропустить']);
    break;
  }

  case Steps.TAGS: {
    const isValidTags = /^[a-zA-Zа-яА-ЯёЁ0-9\s,]+$/.test(text);
      
    if (!isValidTags) {
      await sendReply(ctx, 'Теги могут содержать только буквы, запятые и пробелы', ['Пропустить']);
      break;
    }

    ctx.session.tags = text !== 'Пропустить' ? text.split(',').map(s => s.toLocaleLowerCase().trim()) : [];
    await showPreview(ctx);
    ctx.session.step = Steps.CONFIRM;
    break;
  }


  case Steps.CONFIRM: {
    if (ctx.message?.text === 'Разместить') {
      await publishOffer(ctx);
      ctx.session = {};
      break;
    }

    if (ctx.message?.text === 'Создать заново') {
      ctx.session = {};
      await createOffer(ctx);
      break;
    }

    await sendReply(ctx, 'Пожалуйста, выберите "Разместить" или "Создать заново"');
    break;
  }

  default: {
    ctx.session = {};
    try {
      await sendSticker(ctx, StickerType.ERROR);
      await removeKeyboard(ctx, 'Что-то пошло не так. Попробуйте снова.');
    } catch (error) {
      console.error(error);
    }
    break;
  }
  }
};
