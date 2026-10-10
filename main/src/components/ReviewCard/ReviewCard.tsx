'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import classNames from 'classnames';

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
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <li
      ref={ref}
      className={classNames(styles.card, isVisible && styles.visible)}
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
