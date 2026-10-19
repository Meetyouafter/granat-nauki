import { type IconProps, STROKE_ICON_PROPS } from './iconProps';

const AlertIcon = (props: IconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    strokeWidth="1.5"
    {...STROKE_ICON_PROPS}
    aria-hidden="true"
    {...props}
  >
    <circle cx="6" cy="6" r="4.25" />
    <path d="M6 3.75v2.5M6 8.25v.01" />
  </svg>
);

export default AlertIcon;
