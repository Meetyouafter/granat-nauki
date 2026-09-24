import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import metadata from '@/data/metadata';
import NotFoundContent from './[locale]/not-found';

export const generateMetadata = (): Metadata => metadata.notFound[routing.defaultLocale];

const NotFound = async () => {
  const locale = routing.defaultLocale;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider>
        <Header />
        <NotFoundContent />
        <Footer />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
};

export default NotFound;
