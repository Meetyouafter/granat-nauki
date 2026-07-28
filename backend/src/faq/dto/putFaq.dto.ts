import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { SaveFaqDto } from './saveFaq.dto';

export class PutFaqDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveFaqDto)
  items!: SaveFaqDto[];
}
