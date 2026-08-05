import { Injectable } from '@nestjs/common';
import { Locale } from '@interfaces';
import { ConfigService } from '@nestjs/config';
import { DEEPL_LOCALE_MAP } from '@constants';
import { GetTranslateDto } from './dto/getTranslate.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DeeplService {
  constructor(private readonly configService: ConfigService) {}

  async sendTextToTranslate(text: string[], language: Locale) {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${this.configService.get('DEEPL_KEY')}`,
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
    return data.translations.map((t) => t.text);
  }
}
