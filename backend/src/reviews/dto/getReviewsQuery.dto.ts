import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive } from 'class-validator';
import type { Locale } from '@interfaces';
import { LOCALE_EN, LOCALE_RU } from '@constants';

export class GetReviewsQueryDto {
  @IsOptional()
  @IsIn([LOCALE_RU, LOCALE_EN])
  locale?: Locale;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;
}
