import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { type Theme, ThemeProvider } from '@/contexts/ThemeContext';
import { routing } from '@/i18n/routing';
import Cookie from '@components/Cookie/Cookie';
import Footer from '@components/Footer/Footer';
import Header from '@components/Header/Header';
import { THEME } from '@constants';
import metadata from '@data/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.template[locale] : metadata.template.en;
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const LocaleLayout = async ({ children, params }: Props) => {
  const { locale } = await params;
  const theme = await cookies().then(res => res.get(THEME)?.value) as Theme | undefined;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider initialTheme={theme}>
        <Header />
        {children}
        <Footer />
        <Cookie />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
