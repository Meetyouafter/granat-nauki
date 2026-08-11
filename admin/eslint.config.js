import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * FSD: слои импортируются только «сверху вниз».
 * app → pages → widgets → features → entities → shared
 */
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

/**
 * Порядок импортов: react и его библиотеки → остальные пакеты → слои сверху вниз →
 * относительные пути → стили. Внутри группы — по алфавиту.
 * Побеждает самое длинное совпадение, поэтому `@shared/...` попадает в свою группу,
 * а не в общую группу пакетов, а `./Foo.module.scss` — в стили, а не в относительные.
 */
const IMPORT_GROUPS = [
  ['^\\u0000'],
  ['^react'],
  ['^@?\\w'],
  ...LAYERS.map((layer) => [`^@${layer}`]),
  ['^\\.'],
  ['\\.s?css$'],
]

/**
 * Слои, которые запрещено импортировать из слоя `layer`: всё, что выше него,
 * плюс он сам — импорт соседнего слайса идёт мимо публичного API.
 * Исключение — shared: он поделён на сегменты, а не на слайсы, и внутри себя
 * (ui → config, api → lib) ходит свободно.
 */
const forbiddenLayers = (layer) =>
  LAYERS.slice(0, LAYERS.indexOf(layer) + (layer === 'shared' ? 0 : 1))

/** Правило границ слоёв для одного слоя. */
const layerBoundary = (layer) => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          ...forbiddenLayers(layer).map((forbidden) => ({
            group: [`@${forbidden}`, `@${forbidden}/**`],
            message:
              forbidden === layer
                ? `Внутри слоя «${layer}» используйте относительные импорты, а не алиас @${forbidden}.`
                : `Слой «${layer}» не может импортировать слой «${forbidden}» (FSD: только сверху вниз).`,
          })),
          {
            // публичный API слайса — только его index.ts
            group: ['@pages/*/**', '@widgets/*/**', '@features/*/**', '@entities/*/**'],
            message:
              'Импортируйте слайс через его публичный API (@layer/slice), а не напрямую из внутренностей.',
          },
          {
            group: ['../../*', '../../**'],
            message:
              'Выход за пределы слайса относительным путём запрещён — используйте алиасы (@shared, @entities, ...).',
          },
        ],
      },
    ],
  },
})

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'simple-import-sort/imports': ['error', { groups: IMPORT_GROUPS }],
    },
  },
  // границы слоёв (app — самый верхний, ему разрешено всё, кроме импорта самого себя по алиасу)
  ...LAYERS.map(layerBoundary),
])
