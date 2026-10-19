import { type IconProps, STROKE_ICON_PROPS } from './iconProps';

const ChevronIcon = (props: IconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    strokeWidth="1.5"
    {...STROKE_ICON_PROPS}
    aria-hidden="true"
    {...props}
  >
    <path d="M7.5 2.5 4 6l3.5 3.5" />
  </svg>
);

export default ChevronIcon;
