import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

const supportedLocales = ['ru', 'en'];

export default getRequestConfig(async ({locale}) => {
  const tt = await locale;
  console.log(tt);
  console.log(locale);

  if (!supportedLocales.includes(locale as any)) notFound();
  const currentLocale = locale as string;
 
  return {
    locale: currentLocale as string,
    messages: (await import(`./locales/${currentLocale}.json`)).default
  };
});
