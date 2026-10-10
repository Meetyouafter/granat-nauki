import { type AbstractIntlMessages, hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

// TODO: requestLocale устарел, перейти на next/root-params: https://next-intl.dev/blog/nextjs-root-params
// eslint-disable-next-line @typescript-eslint/no-deprecated
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: ((await import(`../locales/${locale}.json`)) as { default: AbstractIntlMessages }).default,
  };
});
