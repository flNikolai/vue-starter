import type { PluginOption } from 'vite'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default (): PluginOption[] => ([
  AutoImport({
    eslintrc: {
      enabled: true,
    },
    include: [
      /\.[tj]sx?$/,
      /\.vue$/,
      /\.vue\?vue/,
      /\.md$/,
    ],

    imports: [
      'vue',
      'vue-router',
      {
        // 'pinia': ['storeToRefs'],
        // "vue-router": ["createRouter", "createWebHashHistory"],
        'vue-sonner': [
          'toast',
        ],
      },
    ],
    dts: 'src/auto-imports.d.ts',

    defaultExportByFilename: false,
    vueTemplate: true,
  }),

  Components({
    // dirs: [
    //   'src/shared/ui',
    //   'src/shared/lib/use',
    // ],

    dts: 'src/components.d.ts',

    extensions: ['vue'],
  }),
])
