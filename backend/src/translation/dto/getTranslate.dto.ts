import { IsArray, IsNotEmpty } from 'class-validator';

interface Translation {
  detected_source_language: string;
  text: string;
  billed_characters: number;
  model_type_used: string;
  tag_handling_version: string;
}

export class GetTranslateDto {
  @IsArray()
  @IsNotEmpty()
  translations!: Translation[];
}
