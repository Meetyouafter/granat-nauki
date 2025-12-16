import Footer from '@components/Footer/Footer';
import Header from '@components/Header/Header';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Cookie from '@components/Cookie/Cookie';
import { cookies } from 'next/headers';

import '@styles/index.scss';

import { Roboto } from 'next/font/google';
import { THEME } from '@constants';
 
const roboto = Roboto({
  subsets: ['cyrillic'],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};
 
const Layout = async ({children, params}: Props) => {
  const theme = await cookies().then(res => res.get(THEME)?.value);
  const {locale} = await params;
  const messages = await getMessages();

  return (
    <html data-theme={theme} lang={locale}>
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
};

export default Layout;