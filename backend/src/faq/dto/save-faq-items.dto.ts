import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { SaveFaqItemDto } from './save-faq-item.dto';

export class SaveFaqItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveFaqItemDto)
  items!: SaveFaqItemDto[];
}
