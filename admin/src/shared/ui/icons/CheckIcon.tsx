import { type IconProps, STROKE_ICON_PROPS } from './iconProps';

const CheckIcon = (props: IconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    strokeWidth="1.75"
    {...STROKE_ICON_PROPS}
    aria-hidden="true"
    {...props}
  >
    <path d="m2.5 6.5 2.5 2.5 4.5-6" />
  </svg>
);

export default CheckIcon;
