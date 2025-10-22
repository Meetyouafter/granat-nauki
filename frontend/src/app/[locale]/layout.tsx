import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}