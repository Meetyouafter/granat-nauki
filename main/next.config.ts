import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import path from 'node:path';

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '..'),
  reactCompiler: true,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
