import { base, reactConfig } from '@granat/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['public/**', 'build/**', 'out/**', 'coverage/**']),
  ...base({
    tsconfigRootDir: import.meta.dirname,
    aliasGroups: [['^@/', '^@(?:constants|data|styles|components|ui)(?:/|$)']],
  }),
  ...reactConfig,
  nextPlugin.configs['core-web-vitals'],
  {
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['../*'],
          message: 'Используй алиас @/... вместо относительного пути из родительской папки.',
        }],
      }],
    },
  },
]);
