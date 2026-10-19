import { type IconProps, STROKE_ICON_PROPS } from './iconProps';

const ArrowUpIcon = (props: IconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    strokeWidth="1.5"
    {...STROKE_ICON_PROPS}
    aria-hidden="true"
    {...props}
  >
    <path d="M6 9.5v-7M3 5.5l3-3 3 3" />
  </svg>
);

export default ArrowUpIcon;
