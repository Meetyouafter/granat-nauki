import type { FC } from 'react';
import Image from 'next/image';

import styles from './ReviewCard.module.scss';

interface IReviewCard {
  src: string;
  alt: string;
}

const ReviewCard: FC<IReviewCard> = ({ src, alt }) => (
  <li className={styles.card}>
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      className={styles.image}
    />
  </li>
);

export default ReviewCard;
