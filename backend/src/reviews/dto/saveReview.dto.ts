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
  SessionFormat,
} from '@constants';
import { ServiceType } from '../entities/service-type.enum';

export class SaveReviewDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  id?: number;

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

  @IsEnum(ReviewStatus)
  status!: ReviewStatus;

  @Type(() => Date)
  @IsDate()
  reviewDate!: Date;
}
