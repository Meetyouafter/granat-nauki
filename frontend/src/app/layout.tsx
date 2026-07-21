import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';

import '@styles/index.scss';

import { Roboto } from 'next/font/google';
import { THEME } from '@constants';
import type { Theme } from '@/contexts/ThemeContext';

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
});

type Props = {
  children: React.ReactNode;
};

const RootLayout = async ({ children }: Props) => {
  const theme = await cookies().then(res => res.get(THEME)?.value) as Theme | undefined;
  const locale = await getLocale();

  return (
    <html data-theme={theme} lang={locale}>
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
