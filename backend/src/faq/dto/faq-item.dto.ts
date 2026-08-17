import { TranslationStatus } from '@constants';

/**
 * Ответ API. Схему для Swagger строит CLI-плагин по типам полей,
 * class-validator здесь не нужен — глобальный ValidationPipe проверяет только входящее.
 */
export class FaqItemDto {
  id!: number;

  question!: string;

  answer!: string;

  /** Статус перевода на другие языки. Заполняется только для оригинала (ru). */
  translationStatus?: TranslationStatus;
}
