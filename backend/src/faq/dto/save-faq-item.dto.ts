import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';

/** Без id — новый вопрос, с id — правка существующего. */
export class SaveFaqItemDto {
  @IsString()
  @IsNotEmpty()
  question!: string;

  @IsString()
  @IsNotEmpty()
  answer!: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  id?: number;
}
