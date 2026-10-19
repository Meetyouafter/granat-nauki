import type { IconProps } from './iconProps';

const GripIcon = (props: IconProps) => (
  <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true" {...props}>
    <circle cx="4" cy="3.5" r="1.25" />
    <circle cx="8" cy="3.5" r="1.25" />
    <circle cx="4" cy="8" r="1.25" />
    <circle cx="8" cy="8" r="1.25" />
    <circle cx="4" cy="12.5" r="1.25" />
    <circle cx="8" cy="12.5" r="1.25" />
  </svg>
);

export default GripIcon;
