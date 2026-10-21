import { getFormatter, getTranslations } from 'next-intl/server';

import Card from '@ui/Card/Card';
import Text from '@ui/Text/Text';

import styles from './ServiceCard.module.scss';

interface IServiceCard {
  title: string;
  description: string;
  duration: number;
  price: number;
}

const ServiceCard = async ({ title, description, duration, price }: IServiceCard) => {
  const t = await getTranslations('ServicesPage');
  const format = await getFormatter();

  const priceWithCurrency = format.number(price, {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  });

  return (
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
          {priceWithCurrency}
        </Text>
        <Text as="span" size="xs" className={styles.duration}>
          {t('duration', { count: duration })}
        </Text>
      </div>
    </Card>
  );
};

export default ServiceCard;
