import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive } from 'class-validator';
import { LOCALES, type Locale } from '@constants';

/** Общие query-параметры списочных эндпоинтов. */
export class LocaleListQueryDto {
  @IsOptional()
  @IsIn(LOCALES)
  locale?: Locale;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;
}
