import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class FaqItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  id: number;
}
