import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    PORT: '1111'
  }
};
 
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
export default withNextIntl(nextConfig);