export const escapeMarkdown = (text: string | undefined): string => {
  if (!text) return '';
  
  // Экранируем все специальные символы для MarkdownV2
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
};
