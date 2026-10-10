// Общие правила ESLint для всех пакетов репозитория.
// Конфиг приложения собирается из base() и reactConfig и добавляет только своё:
// группы алиасов в сортировке импортов, Next-плагин, границы FSD и т. п.
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { globalIgnores } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const JS_FILES = ['**/*.{js,jsx,mjs,cjs}'];

/**
 * Порядок импортов, одинаковый во всех пакетах:
 * side-effect → react/next → остальные пакеты → алиасы пакета → относительные → стили.
 * Внутри группы по алфавиту. Побеждает самое длинное совпадение, поэтому `@ui/...`
 * попадает в группу алиасов, а не в общую группу пакетов.
 */
const importGroups = aliasGroups => [
  ['^\\u0000(?!.*\\.s?css$)'],
  ['^react', '^next'],
  ['^node:', '^@?\\w'],
  ...aliasGroups,
  ['^\\.'],
  ['^\\u0000.+\\.s?css$', '\\.s?css$'],
];

// Параметры описаны в index.d.ts.
export const base = ({ tsconfigRootDir, aliasGroups = [] }) => [
  globalIgnores(['**/node_modules', '**/dist', '**/.next', '**/src/generated', '**/next-env.d.ts']),

  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    jsx: true,
    braceStyle: '1tbs',
    commaDangle: 'always-multiline',
  }),

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
    },
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      '@stylistic/max-len': ['error', {
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@typescript-eslint/restrict-template-expressions': ['error', {
        allowNumber: true,
        allowAny: false,
        allowBoolean: false,
        allowNullish: false,
        allowRegExp: false,
        allowNever: false,
        allowArray: false,
      }],
      'no-duplicate-imports': 'error',
      'simple-import-sort/imports': ['error', { groups: importGroups(aliasGroups) }],
      'simple-import-sort/exports': 'error',
    },
  },

  { files: JS_FILES, ...tseslint.configs.disableTypeChecked },
];

export const reactConfig = [
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  { settings: { react: { version: 'detect' } } },
];
