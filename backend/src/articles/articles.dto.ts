import { IsString, IsNotEmpty, IsPositive, IsInt } from 'class-validator';

export class ArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsPositive()
  id: number;
}
