import antfu from '@antfu/eslint-config'
import importFsdPlugin from 'eslint-plugin-import-fsd'

export default antfu({
  // test
  plugins: {
    'import-fsd': importFsdPlugin,
  },

  settings: {
    fsd: {
      rootDir: `./src`,
    },
  },

  rules: {
    'import-fsd/no-denied-layers': [
      'error',
      { ignores: ['app'] },
    ],
  },
  // test

  lessOpinionated: true,

  // Игнорируемые файлы
  ignores: [
    'node_modules/**',
    'dist/**',
    'public/**',
    '.vscode/**',
  ],

  // Настройки для Vue
  vue: {
    a11y: true,
    overrides: {
      // Правила форматирования
      'vue/operator-linebreak': ['error', 'before'], // Операторы (&&, ||) должны быть перед новой строкой
      'vue/max-attributes-per-line': ['error', { singleline: { max: 1 }, multiline: { max: 1 } }], // Один атрибут на строку для читаемости
      'vue/html-indent': ['error', 2, { attribute: 1, baseIndent: 1, closeBracket: 0, alignAttributesVertically: true }], // Отступы в шаблонах
      'vue/html-self-closing': ['error', { html: { void: 'never', normal: 'always', component: 'always' }, svg: 'always', math: 'always' }], // Самозакрывающиеся теги для компонентов
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }], // Порядок блоков в .vue файлах

      // Правила логики
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: false,
        },
      ], // Порядок атрибутов в тегах
      'vue/block-lang': ['error', { script: { lang: 'ts' }, style: { lang: 'scss' } }], // Требуем TypeScript и SCSS
    },
  },

  // Настройки для TypeScript
  typescript: {
    tsconfigPath: './tsconfig.json',
    overrides: {
      'ts/semi': 'off',
      'ts/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'ts/explicit-function-return-type': 'off',
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-member-access': 'off',
    },
  },

  // Форматирование
  formatters: {
    css: false,
    html: false,
    markdown: false,
  },
})
