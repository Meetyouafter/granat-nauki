import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'node_modules/**',
    'dist/**',
    'public/**',
    'build/**',
    '.next/**',
    'out/**',
    'coverage/**',
    'src/generated/**',
    'next-env.d.ts',
    '*.config.js',
    '*.config.ts',
    '*.config.mjs',
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: { '@stylistic': stylistic, 'simple-import-sort': simpleImportSort },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/max-len': ['error', {
        'code': 100, 'ignoreUrls': true, 'ignoreStrings': true, 'ignoreTemplateLiterals': true,
      }],
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single', { 'avoidEscape': true }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/no-multiple-empty-lines': ['error', { 'max': 1, 'maxBOF': 0, 'maxEOF': 0 }],
      'no-duplicate-imports': 'error',
      'simple-import-sort/imports': ['error', {
        'groups': [
          // библиотеки (и side-effect импорты, кроме стилей)
          ['^\\u0000(?!.*\\.s?css$)', '^node:', '^@?\\w'],
          // алиасы из tsconfig
          ['^@/', '^@(?:constants|data|styles|components|ui)(?:/|$)'],
          // относительные
          ['^\\.'],
          // стили
          ['^\\u0000.+\\.s?css$', '^.+\\.s?css$'],
        ],
      }],
      'simple-import-sort/exports': 'error',
      'no-restricted-imports': ['error', {
        'patterns': [{
          'group': ['../*'],
          'message': 'Используй алиас @/... вместо относительного пути из родительской папки.',
        }],
      }],
    },
  },
]);
