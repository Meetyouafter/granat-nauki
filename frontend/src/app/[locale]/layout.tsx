import type { ReactNode } from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';

export const metadata = {
  title: 'Психолог — сайт‑визитка',
  description: 'Помогаю справляться со сложными эмоциями и находить опору.',
};

import '../../styles/globals.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const locales = ['ru', 'en'];

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages();
  
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LanguageSwitcher />
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
