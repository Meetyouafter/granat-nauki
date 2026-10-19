import { type IconProps, STROKE_ICON_PROPS } from './iconProps';

const PlusIcon = (props: IconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    strokeWidth="1.75"
    {...STROKE_ICON_PROPS}
    aria-hidden="true"
    {...props}
  >
    <path d="M6 2.5v7M2.5 6h7" />
  </svg>
);

export default PlusIcon;
