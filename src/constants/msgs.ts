import { UserType } from '../db/handeleUsers';

export const startMsg = (firstName: string, userType: UserType) => (`${userType === 'new' ? 'Салют' : 'С возвращением'}, ${firstName}! 
Тут ты ${userType === 'old' ? 'по-прежнему ' : ' '}можешь добавить свои торговые предложения!
Или просто объявить о поиске тюнячки своей мечты 🫠
`);