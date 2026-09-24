'use client';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import styles from './Slider.module.scss';

const AUTOPLAY_INTERVAL_MS = 3000;

interface ISliderItem {
  src: string;
  alt: string;
}

interface ISlider {
  items: ISliderItem[];
  className?: string;
}

const Slider: FC<ISlider> = ({ items, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  const restartAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNext, AUTOPLAY_INTERVAL_MS);
  };

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [items.length]);

  const handleClick = () => {
    goToNext();
    restartAutoplay();
  };

  return (
    <button
      type="button"
      aria-label="Next slide"
      className={classNames(styles.slider, className)}
      onClick={handleClick}
    >
      {items.map((item, index) => (
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className={classNames(styles.image, { [styles.imageActive]: index === activeIndex })}
        />
      ))}
    </button>
  );
};

export default Slider;
