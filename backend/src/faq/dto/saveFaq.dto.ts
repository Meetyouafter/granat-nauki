import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';

export class SaveFaqDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  id?: number;
}
