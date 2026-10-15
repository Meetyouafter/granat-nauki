'use client';

import { type FC, useEffect, useRef, useState } from 'react';

import cns from 'classnames';

import styles from './StatCounter.module.scss';

interface IStatCounter {
  value: number;
  suffix?: string;
  className?: string | undefined;
  duration?: number;
}

const StatCounter: FC<IStatCounter> = ({ value, suffix = '', className, duration = 1200 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setCount(Math.round(value * (1 - (1 - progress) ** 3)));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={cns(styles.counter, className)}>
      {count}
      {suffix}
    </span>
  );
};

export default StatCounter;
