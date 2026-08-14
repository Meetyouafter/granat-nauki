import { Injectable, NotFoundException } from '@nestjs/common';
import { GetReviewDto } from './dto/getReview.dto';
import { ServiceType } from './entities/service-type.enum';
import { SessionFormat, TranslationStatus } from '@constants';
import { ReviewStatus } from 'src/constants/review-status.enum';

const REVIEWS_MOCK: GetReviewDto[] = [
  {
    id: 1,
    review: 'Review',
    age: 2.5,
    service: ServiceType.DIAGNOSTICS,
    format: SessionFormat.ONLINE,
    reviewDate: new Date(),
    translationStatus: TranslationStatus.PENDING,
    status: ReviewStatus.PUBLISHED,
  },
  {
    id: 2,
    review: 'Review',
    age: 25,
    service: ServiceType.DIAGNOSTICS,
    format: SessionFormat.ONLINE,
    reviewDate: new Date(),
    translationStatus: TranslationStatus.FAILED,
    status: ReviewStatus.DRAFT,
  },
];

@Injectable()
export class ReviewsService {
  // TODO delete
  async delay() {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
  }
  async getReviews() {
    await this.delay();
    return REVIEWS_MOCK;
  }

  async getReview(id: number) {
    await this.delay();
    const review = REVIEWS_MOCK.find((el) => el.id === id);

    if (!review) {
      throw new NotFoundException();
    }

    return review;
  }
}
