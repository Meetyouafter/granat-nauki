import { getTranslations } from 'next-intl/server';

import classNames from 'classnames';

import { paths } from '@constants';
import Button from '@ui/Button/Button';
import Text from '@ui/Text/Text';

import styles from './EmptyState.module.scss';

interface IEmptyState {
  title?: string;
  text?: string;
  className?: string | undefined;
}

const EmptyState = async ({ title, text, className }: IEmptyState) => {
  const t = await getTranslations('EmptyState');

  return (
    <div className={classNames(styles.root, className)}>
      <Text as="p" size="md" weight="semibold" italic className={styles.title}>
        {title ?? t('title')}
      </Text>
      <Text className={styles.text}>{text ?? t('text')}</Text>
      <Button href={paths.home}>{t('home')}</Button>
    </div>
  );
};

export default EmptyState;
