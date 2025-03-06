import eslint from '@eslint/js';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // Игнорировать все файлы в папке dist и её подпапках
  {
    ignores: ['dist/**']
  },

  // Базовые рекомендуемые правила ESLint
  eslint.configs.recommended,

  // Конфигурация для TypeScript
  {
    // Применять правила к .ts и .tsx файлам во всех папках
    files: ['**/*.{ts,tsx}'],

    // Настройки парсера
    languageOptions: {
      parser: tsParser, // Использовать парсер TypeScript
      parserOptions: {
        ecmaVersion: 'latest', // Использовать последнюю версию ECMAScript
        sourceType: 'module'   // Обрабатывать код как ES модули
      },
      // Глобальные настройки ECMAScript
      ecmaVersion: 2022,      // Версия ECMAScript для всех файлов
      sourceType: 'module',    // Все файлы обрабатываются как модули
      
      // Глобальные переменные
      globals: {
        // Добавляем все глобальные переменные Node.js
        'process': true,
        'Buffer': true,
        '__dirname': true,
        '__filename': true,
        'console': true,
        'exports': true,
        'module': true,
        'require': true,
        'global': true
      }
    },

    // Подключаем плагин с правилами для TypeScript
    plugins: {
      '@typescript-eslint': tseslint
    },

    // Правила линтинга
    rules: {
      // Базовые правила форматирования
      'indent': ['error', 2],           // Отступ 2 пробела
      'linebreak-style': ['error', 'unix'], // Использовать UNIX-стиль переносов строк (LF)
      'quotes': ['error', 'single'],    // Использовать одинарные кавычки
      'semi': ['error', 'always'],      // Всегда требовать точку с запятой
      'no-unused-vars': 'off',          // Отключаем базовое правило для неиспользуемых переменных

      // Правила TypeScript
      '@typescript-eslint/no-explicit-any': 'error',     // Запретить использование типа 'any'
      '@typescript-eslint/explicit-function-return-type': 'off', // Не требовать явного указания возвращаемого типа функций
      '@typescript-eslint/no-unused-vars': [            // Проверка неиспользуемых переменных
        'error',
        {
          'argsIgnorePattern': '^_',    // Игнорировать параметры, начинающиеся с underscore
          'varsIgnorePattern': '^[A-Z]' // Игнорировать константы (переменные в UPPER_CASE)
        }
      ]
    }
  }
]; 