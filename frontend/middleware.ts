import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localeDetection: true
});
 
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
