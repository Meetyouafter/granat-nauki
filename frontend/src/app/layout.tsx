import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';

import '@styles/index.scss';

import { Alegreya, Manrope } from 'next/font/google';
import { THEME } from '@constants';
import type { Theme } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
  },
  manifest: '/favicon/site.webmanifest',
};

const alegreya = Alegreya({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
});

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
});

type Props = {
  children: React.ReactNode;
};

const RootLayout = async ({ children }: Props) => {
  const theme = await cookies().then(res => res.get(THEME)?.value) as Theme | undefined;
  const locale = await getLocale();

  return (
    <html data-theme={theme} lang={locale}>
      <body className={`${alegreya.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
