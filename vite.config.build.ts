import type { BuildOptions, ServerOptions } from 'vite'

import path from 'node:path'

const config: { server: ServerOptions, build: BuildOptions } = {
  server: {
    port: 6767,
    host: '0.0.0.0',
    // proxy: {
    //   "/api": {
    //     target: apiDomain,
    //     changeOrigin: true,
    //     rewrite: (path: string) => path.replace(/^\/api/, "/api"),
    //     configure: (proxy, _options) => {
    //       proxy.on("proxyReq", (proxyReq, req, _res) => {
    //         proxyReq.setHeader("X-Real-IP", req.socket.remoteAddress || "unknown");
    //       });
    //     },
    //   },
    // },
  },

  build: {
    target: 'esnext',
    cssTarget: 'chrome79',
    minify: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
}

export default config
