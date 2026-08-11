import {
  IsString,
  IsNotEmpty,
  IsPositive,
  IsEnum,
  IsOptional,
  IsInt,
} from 'class-validator';
import { TranslationStatus } from '@constants';

export class GetFaqDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @IsPositive()
  id!: number;

  @IsOptional()
  @IsEnum(TranslationStatus)
  translationStatus?: TranslationStatus;
}
