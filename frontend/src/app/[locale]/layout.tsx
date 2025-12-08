import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Cookie from '@/components/Cookie/Cookie';

import '@/styles/index.scss';

import { Roboto } from 'next/font/google';
 
const roboto = Roboto({
  subsets: ['cyrillic'],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};
 
export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={roboto.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <Header />
            {children}
            <Footer />
            <Cookie />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}