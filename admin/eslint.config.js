import { base, reactConfig } from '@granat/eslint-config';
import { defineConfig } from 'eslint/config';
import reactRefresh from 'eslint-plugin-react-refresh';

/**
 * FSD: слои импортируются только «сверху вниз».
 * app → pages → widgets → features → entities → shared
 */
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];

/**
 * Слои, которые запрещено импортировать из слоя `layer`: всё, что выше него,
 * плюс он сам — импорт соседнего слайса идёт мимо публичного API.
 * Исключение — shared: он поделён на сегменты, а не на слайсы, и внутри себя
 * (ui → config, api → lib) ходит свободно.
 */
const forbiddenLayers = layer =>
  LAYERS.slice(0, LAYERS.indexOf(layer) + (layer === 'shared' ? 0 : 1));

/** Правило границ слоёв для одного слоя. */
const layerBoundary = layer => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          ...forbiddenLayers(layer).map(forbidden => ({
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
});

export default defineConfig([
  ...base({
    tsconfigRootDir: import.meta.dirname,
    // каждый слой FSD — своя группа импортов, сверху вниз
    aliasGroups: LAYERS.map(layer => [`^@${layer}`]),
  }),
  ...reactConfig,
  reactRefresh.configs.vite,
  ...LAYERS.map(layerBoundary),
]);
