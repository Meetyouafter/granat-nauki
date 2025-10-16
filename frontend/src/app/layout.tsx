import type { ReactNode } from 'react';

export const metadata = {
  title: 'Психолог — сайт‑визитка',
  description: 'Помогаю справляться со сложными эмоциями и находить опору.',
};

import '../styles/globals.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}


