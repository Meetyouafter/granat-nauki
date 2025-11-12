import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { ThemeProvider } from '@/contexts/ThemeContext';

import '@/styles/globals.scss'; 
import '@/styles/reset.scss';

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

  return (
    <html lang={locale}>
      <body className={roboto.className}>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}