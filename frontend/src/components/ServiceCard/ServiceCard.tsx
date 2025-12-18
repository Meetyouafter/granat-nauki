'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './ServiceCard.module.scss';

type ServiceCardProps = {
  title: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  index: number;
};

export default function ServiceCard({
  title,
  description,
  duration,
  price,
  image,
  index,
}: ServiceCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <li
      ref={cardRef}
      className={`${styles.card} ${isVisible ? styles.visible : ''}`}
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
}




