import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';

import '@/styles/globals.scss'; 
import '@/styles/reset.scss';

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};
 
export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  return (
    <html lang={locale}>
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}