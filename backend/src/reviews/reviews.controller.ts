import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { GetReviewDto } from './dto/getReview.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Get()
  async getReviews(): Promise<GetReviewDto[]> {
    return await this.reviewService.getReviews();
  }

  @Get(':id')
  async getReview(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetReviewDto> {
    return await this.reviewService.getReview(id);
  }
}
