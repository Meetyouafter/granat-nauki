import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['en', 'ru'],
  defaultLocale: 'ru'
});

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default
  };
});
