'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import classNames from 'classnames';

import styles from './ServiceCard.module.scss';

interface IServiceCard {
  title: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  index: number;
}

const ServiceCard: FC<IServiceCard> = ({
  title,
  description,
  duration,
  price,
  image,
  index,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <li
      ref={cardRef}
      className={classNames(styles.card, isVisible && styles.visible)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={title}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.details}>
          <span className={styles.duration}>{duration}</span>
          <span className={styles.price}>{price}</span>
        </div>
      </div>
    </li>
  );
};

export default ServiceCard;
