'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './StatCounter.module.scss';

type Props = {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
};

export default function StatCounter({ value, suffix = '', className, duration = 1200 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
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
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={[styles.counter, className].filter(Boolean).join(' ')}>
      {count}
      {suffix}
    </span>
  );
}
