type Props = {
  variant?: 'plate' | 'seed';
  className?: string;
};

const seeds: Array<[number, number, number]> = [
  [78, 88, 5.5], [92, 82, 4.5], [86, 100, 6], [70, 104, 4.5], [80, 116, 5],
  [98, 110, 4], [64, 90, 4], [96, 96, 3.5],
  [122, 84, 4.5], [136, 90, 5.5], [128, 102, 4.5], [144, 106, 4],
  [130, 118, 5], [116, 92, 4], [140, 78, 3.5],
  [104, 132, 5], [118, 140, 4.5], [96, 146, 5.5], [110, 154, 4],
  [86, 136, 4], [124, 150, 3.5],
  [70, 130, 4.5], [58, 118, 4], [66, 144, 5], [52, 132, 3.5],
];

const PomegranateMark = ({ variant = 'plate', className }: Props) => {
  if (variant === 'seed') {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 3.5c3.6 2.4 6 6 6 9.6a6 6 0 1 1-12 0c0-3.6 2.4-7.2 6-9.6Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M12 3.5 10.6 6.2M12 3.5l1.4 2.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="12" cy="14" r="1.6" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M100 22c8-8 18-13 27-11-2 9-8 17-16 22 22 8 39 29 39 55a50 50 0 1 1-100 0c0-26 17-47 39-55-8-5-14-13-16-22 9-2 19 3 27 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M100 88v88" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M100 88C78 96 62 112 58 132" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M100 88c22 8 38 24 42 44" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M58 132c-6 12-8 24-4 34" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M142 132c6 12 8 20 4 30" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      {seeds.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="currentColor" opacity="0.85" />
      ))}
    </svg>
  );
};

export default PomegranateMark;
