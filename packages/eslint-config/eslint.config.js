import { defineConfig } from 'eslint/config';

import { base } from './index.js';

export default defineConfig([
  ...base({ tsconfigRootDir: import.meta.dirname }),
]);
