import { ApiProperty } from '@nestjs/swagger';

export class FaqItemDto {
  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }

  @ApiProperty({ description: 'Title of the FAQ item' })
  title: string;

  @ApiProperty({ description: 'Description of the FAQ item' })
  description: string;
}
