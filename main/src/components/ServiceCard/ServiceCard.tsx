import type { FC } from 'react';

import Card from '@ui/Card/Card';
import Text from '@ui/Text/Text';

import styles from './ServiceCard.module.scss';

interface IServiceCard {
  title: string;
  description: string;
  duration: string;
  price: string;
}

const ServiceCard: FC<IServiceCard> = ({ title, description, duration, price }) => (
  <Card className={styles.card}>
    <div className={styles.content}>
      <Text as="h2" size="md" weight="semibold" italic className={styles.title}>
        {title}
      </Text>
      <Text as="p" className={styles.description}>
        {description}
      </Text>
    </div>
    <div className={styles.details}>
      <Text as="span" size="lg" weight="semibold" className={styles.price}>
        {price}
      </Text>
      <Text as="span" size="xs" className={styles.duration}>
        {duration}
      </Text>
    </div>
  </Card>
);

export default ServiceCard;
