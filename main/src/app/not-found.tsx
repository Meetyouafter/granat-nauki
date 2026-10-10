import type { Metadata } from 'next';
import { type AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';

import { ThemeProvider } from '@/contexts/ThemeContext';
import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';
import Footer from '@components/Footer/Footer';
import Header from '@components/Header/Header';

import NotFoundContent from './[locale]/not-found';

export const generateMetadata = (): Metadata => metadata.notFound[routing.defaultLocale];

const NotFound = async () => {
  const locale = routing.defaultLocale;
  const messages = ((await import(`@/locales/${locale}.json`)) as { default: AbstractIntlMessages }).default;

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
