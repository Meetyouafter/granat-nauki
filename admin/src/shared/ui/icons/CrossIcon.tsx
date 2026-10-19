import { type IconProps, STROKE_ICON_PROPS } from './iconProps';

const CrossIcon = (props: IconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    strokeWidth="1.75"
    {...STROKE_ICON_PROPS}
    aria-hidden="true"
    {...props}
  >
    <path d="m3 3 6 6M9 3 3 9" />
  </svg>
);

export default CrossIcon;
