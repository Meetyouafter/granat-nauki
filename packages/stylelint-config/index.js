// Общие правила stylelint для SCSS во всех пакетах.
// Приложение подключает их через `extends: ['@granat/stylelint-config']` в .stylelintrc.json.
import postcssScss from 'postcss-scss';
import stylelintOrder from 'stylelint-order';
import stylelintScss from 'stylelint-scss';

/** @type {import('stylelint').Config} */
const config = {
  extends: ['stylelint-config-standard-scss'],
  customSyntax: postcssScss,
  plugins: [stylelintScss, stylelintOrder],
  rules: {
    // CSS-модули: имена читаются из TS как styles.someName, поэтому camelCase.
    // Модификатор от значения пропа допустим через дефис: .size-lg для styles[`size-${size}`].
    'selector-class-pattern': ['^[a-z][a-zA-Z0-9]*(-[a-z0-9]+)?$', {
      message: name => `Класс ${name}: camelCase, модификатор через дефис (.sizeLg нельзя, .size-lg можно)`,
    }],
    'keyframes-name-pattern': ['^[a-z][a-zA-Z0-9]*$', {
      message: name => `@keyframes ${name}: camelCase, как классы CSS-модулей`,
    }],
    // :global/:local и composes — синтаксис CSS-модулей
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
    'order/order': [
      {
        type: 'at-rule',
        name: 'include',
      },
      'declarations',
      {
        type: 'at-rule',
        name: 'include',
        hasBlock: true,
      },
      'rules',
    ],
    'order/properties-order': [
      [
        {
          groupName: 'visibility',
          properties: [
            'opacity',
            'visibility',
            'z-index',
          ],
        },
        {
          groupName: 'transform',
          properties: [
            'transform',
            'transform-origin',
            'rotate',
            'scale',
            'translate',
            'perspective',
          ],
        },
        {
          groupName: 'position',
          properties: [
            'position',
            'inset',
            'top',
            'right',
            'bottom',
            'left',
          ],
        },
        {
          groupName: 'layout',
          properties: [
            'display',
            'flex',
            'flex-direction',
            'flex-wrap',
            'flex-flow',
            'flex-grow',
            'flex-shrink',
            'flex-basis',
            'grid',
            'grid-template',
            'grid-template-columns',
            'grid-template-rows',
            'grid-template-areas',
            'grid-auto-columns',
            'grid-auto-rows',
            'grid-auto-flow',
            'grid-column',
            'grid-row',
            'grid-area',
            'align-items',
            'align-content',
            'align-self',
            'justify-content',
            'justify-items',
            'justify-self',
            'place-items',
            'place-content',
            'place-self',
            'gap',
            'row-gap',
            'column-gap',
          ],
        },
        {
          groupName: 'margin',
          properties: [
            'margin',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
          ],
        },
        {
          groupName: 'border',
          properties: [
            'border',
            'border-top',
            'border-right',
            'border-bottom',
            'border-left',
            'border-width',
            'border-style',
            'border-radius',
          ],
        },
        {
          groupName: 'dimensions',
          properties: [
            'width',
            'min-width',
            'max-width',
            'height',
            'min-height',
            'max-height',
            'aspect-ratio',
          ],
        },
        {
          groupName: 'padding',
          properties: [
            'padding',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
          ],
        },
        {
          groupName: 'overflow',
          properties: [
            'overflow',
            'overflow-x',
            'overflow-y',
          ],
        },
        {
          groupName: 'animation',
          properties: [
            'transition',
            'transition-property',
            'transition-duration',
            'transition-timing-function',
            'animation',
            'animation-name',
            'animation-duration',
            'will-change',
          ],
        },
        {
          groupName: 'font',
          properties: [
            'font',
            'font-family',
            'font-size',
            'font-weight',
            'font-style',
            'line-height',
            'letter-spacing',
            'text-align',
            'text-transform',
            'text-decoration',
            'white-space',
            'text-wrap',
          ],
        },
        {
          groupName: 'color',
          properties: [
            'color',
            'background',
            'background-color',
            'background-image',
            'background-clip',
            'border-color',
            'box-shadow',
            'fill',
            'stroke',
            'cursor',
            'filter',
            'backdrop-filter',
          ],
        },
      ],
      {
        unspecified: 'bottomAlphabetical',
      },
    ],
  },
};

export default config;
