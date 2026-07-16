'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import styles from './ReviewCard.module.scss';

type ReviewCardProps = {
  src: string;
  alt: string;
  index: number;
};

export default function ReviewCard({ src, alt, index }: ReviewCardProps) {
  const t = useTranslations('ReviewsPage');
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <li
      ref={ref}
      className={`${styles.card} ${isVisible ? styles.visible : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
        <span className={styles.badge}>{t('screenshotBadge')}</span>
        <div className={styles.shine} />
      </div>
    </li>
  );
}







