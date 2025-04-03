/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard-scss', // Базовые правила для SCSS
    'stylelint-config-recommended-vue/scss', // Рекомендации для Vue + SCSS
  ],
  plugins: [
    '@stylistic/stylelint-plugin', // Плагин для стилистических правил
    'stylelint-order', // Плагин для сортировки свойств
  ],
  rules: {
    // Общие стилистические правила
    '@stylistic/indentation': 2, // Отступы в 2 пробела
    '@stylistic/number-leading-zero': 'always', // Всегда добавлять ведущий ноль (0.5 вместо .5)
    '@stylistic/color-hex-case': 'lower', // HEX-цвета в нижнем регистре (#fff вместо #FFF)
    '@stylistic/declaration-block-semicolon-newline-after': 'always-multi-line', // Точка с запятой и новая строка в многострочных блоках
    '@stylistic/max-line-length': 80, // Максимальная длина строки (для читаемости)

    'order/properties-alphabetical-order': true,

    // Правила для SCSS
    'scss/at-rule-no-unknown': true, // Запрет неизвестных @-правил в SCSS
    'scss/dollar-variable-pattern': /^[a-z][a-z0-9-]+$/i, // Переменные в kebab-case (например, $font-size)
    'scss/percent-placeholder-pattern': /^[a-z][a-z0-9-]+$/i, // Плейсхолдеры в kebab-case (например, %button-style)
    'scss/no-duplicate-mixins': true, // Запрет дублирования миксинов
    'scss/operator-no-unspaced': true, // Требовать пробелы вокруг операторов (например, 1px + 2px)

    // Общие правила для стилей
    'color-no-invalid-hex': true, // Запрет некорректных HEX-цветов
    'block-no-empty': true, // Запрет пустых блоков
    'declaration-block-no-duplicate-properties': true, // Запрет дублирования свойств в блоке
    'no-descending-specificity': true, // Запрет уменьшения специфичности селекторов
    'selector-max-id': 0, // Запрет использования ID-селекторов
    'selector-class-pattern': [
      '^[a-z][a-z0-9]+(__[a-z0-9]+)?(_[a-z0-9]+)?$', // BEM-нотация
      { message: 'Class names must follow BEM (e.g., block__element_modifier)' },
    ],
  },
  overrides: [
    {
      files: ['*.vue', '**/*.vue'],
      rules: {
        // Специфичные правила для Vue
        'scss/at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: ['apply', 'layer', 'tailwind'], // Исключения для Tailwind или других фреймворков
          },
        ],
        '@stylistic/indentation': 2, // Убедитесь, что отступы согласованы с HTML в Vue
        'declaration-block-no-redundant-longhand-properties': true, // Запрет избыточных стенографических свойств
      },
    },
  ],
}
