import Image from 'next/image';
import { Metadata } from 'next';
import Button from '@ui/Button/Button';
import Text from '@ui/Text/Text';
import { paths } from '@constants';
import metadata from '@/data/metadata';
import styles from './not-found.module.scss';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  return metadata.notFound[locale as keyof typeof metadata.notFound] ?? metadata.notFound.en;
}

const NotFound = () => (
  <main className={styles.root}>
    <Image src="/images/404.png" alt="Страница не найдена" width={320} height={320} className={styles.image} />
    <Text as="p" size="lg" weight="semibold" className={styles.title}>
      Страница не найдена
    </Text>
    <Button href={paths.home}>Вернуться на главную</Button>
  </main>
);

export default NotFound;
