import { type IconProps, STROKE_ICON_PROPS } from './iconProps';

interface IEyeIcon extends IconProps {
  isCrossed?: boolean;
}

const EyeIcon = ({ isCrossed = false, ...props }: IEyeIcon) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    strokeWidth="2"
    {...STROKE_ICON_PROPS}
    aria-hidden="true"
    {...props}
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {isCrossed && <path d="m3 3 18 18" />}
  </svg>
);

export default EyeIcon;
