import { type IconProps, STROKE_ICON_PROPS } from './iconProps';

const SortIcon = (props: IconProps) => (
  <svg width="12" height="12" viewBox="0 0 12 12" strokeWidth="1.5" {...STROKE_ICON_PROPS} {...props}>
    <path d="M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5" />
  </svg>
);

export default SortIcon;
