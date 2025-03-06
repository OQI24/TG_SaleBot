import { Context, SessionFlavor } from 'grammy';

export enum StickerType {
    START = 'START',
    DELETE = 'DELETE',
    GOODBYE = 'GOODBYE',
    ERROR = 'ERROR',
}

export enum Steps {
    CITY = 'city',
    CONFIRM = 'confirm',
    DESCRIPTION = 'description',
    MEDIA = 'media',
    OFFER_TYPE = 'offerType',
    PHONE = 'phone',
    PHONE_NUMBER = 'phoneNumber',
    PRICE = 'price',
    SHIPPING = 'shipping',
    SHIPPING_SERVICES = 'shippingServices',
    TAGS = 'tags',
    TITLE = 'title',
}

export interface MediaFile {
    fileId: string;
    type: 'photo' | 'video';
}

export interface SessionData {
    actionType?: 'create' | 'edit' | 'delete'; // Тип действия
    city?: string; // Город
    description?: string; // Текст объявления
    media?: MediaFile[]; // Медиафайлы
    offerType?: 'Продам' | 'Куплю'; // Тип объявления
    phone?: string; // Телефон для связи
    price?: string; // Цена или бюджет
    shippingServices?: string[]; // Службы доставки
    step?: Steps; // Текущий шаг
    tags?: string[]; // Теги
    title?: string; // Название объявления
    links?: string[]; // Ссылки на существующие объявления
    adsIds?: string[]; // Идентификаторы существующих объявлений
    deleteAdId?: string; // Идентификатор удаляемого объявления
}

export type BotContext = Context & SessionFlavor<SessionData>;

export default BotContext;
