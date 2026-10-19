import type { ComponentPropsWithoutRef } from 'react';

import classNames from 'classnames';

import styles from './Badge.module.scss';

export type BadgeTone = 'neutral' | 'accent' | 'pending' | 'processing' | 'success' | 'error';

interface IBadge extends ComponentPropsWithoutRef<'span'> {
  tone?: BadgeTone;
}

const Badge = ({ tone = 'neutral', className, ...props }: IBadge) => (
  <span {...props} className={classNames(styles.badge, styles[`tone-${tone}`], className)} />
);

export default Badge;
