import type { ConfigEnv, UserConfigExport } from 'vite'
import path from 'node:path'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import progress from 'vite-plugin-progress'
import vueDevTools from 'vite-plugin-vue-devtools'

import Build from './vite.config.build.ts'
import Components from './vite.config.components.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const config: UserConfigExport = {
    base: '/',
    server: Build.server,
    build: Build.build,
    preview: {
      port: Number(process.env.VITE_APP_PORT ?? 3000),
    },
    plugins: [
      vue(),
      vueDevTools(),
      ...Components(),
      progress(),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/app/assets/styles/_fonts" as *;
            @use "@/app/assets/styles/_vars" as *;
            @use "@/app/assets/styles/_mixin" as *;
            @use "@/app/assets/styles/_animations" as *;
          `,
        },
      },
    },
  }
  return config
})
