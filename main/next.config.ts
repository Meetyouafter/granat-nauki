import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    PORT: '1111',
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
