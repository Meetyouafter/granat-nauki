import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  MAX_CHILD_AGE,
  MIN_CHILD_AGE,
  ReviewStatus,
  TranslationStatus,
  SessionFormat,
  ServiceType,
} from '@constants';

export class GetReviewDto {
  @IsInt()
  @IsPositive()
  id!: number;

  @IsString()
  @IsNotEmpty()
  review!: string;

  @IsInt()
  @Min(MIN_CHILD_AGE)
  @Max(MAX_CHILD_AGE)
  age!: number;

  @IsEnum(ServiceType)
  service!: ServiceType;

  @IsEnum(SessionFormat)
  format!: SessionFormat;

  @Type(() => Date)
  @IsDate()
  reviewDate!: Date;

  @IsEnum(ReviewStatus)
  status!: ReviewStatus;

  @IsOptional()
  @IsEnum(TranslationStatus)
  translationStatus?: TranslationStatus;
}
