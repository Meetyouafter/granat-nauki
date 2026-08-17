import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEEPL_LOCALE_MAP, type Locale } from '@constants';
import { GetTranslateDto } from './dto/getTranslate.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DeeplService {
  constructor(private readonly configService: ConfigService) {}

  async sendTextToTranslate(
    text: string[],
    language: Locale,
  ): Promise<string[]> {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${this.configService.getOrThrow<string>('DEEPL_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        target_lang: DEEPL_LOCALE_MAP[language],
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepL error: ${response.status}`);
    }

    const raw: unknown = await response.json();
    const data = plainToInstance(GetTranslateDto, raw);

    if (!Array.isArray(data.translations)) {
      throw new Error('DeepL error: в ответе нет поля translations');
    }

    const translated = data.translations.map((translation) => translation.text);

    if (translated.length !== text.length) {
      throw new Error(
        `DeepL error: отправлено строк ${text.length}, получено ${translated.length}`,
      );
    }

    return translated;
  }
}
