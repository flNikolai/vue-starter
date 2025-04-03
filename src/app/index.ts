import { init } from '@/shared/utils/init'
import { createHead } from '@unhead/vue/client'
import { createApp } from 'vue'
import { onFCP, onFID, onLCP } from 'web-vitals'
import App from './App.vue'
import { router } from './providers'

if (import.meta.env.VITE_APP_MODE === 'development') {
  // eslint-disable-next-line no-console
  console.log(
    `%c⚡ ${import.meta.env.VITE_APP_MODE} mode | ${import.meta.env.VITE_APP_VERSION as string || 'local'}\n`
    + `%c🚀 Build time: ${new Date().toLocaleString()}`,
    'color: #4CAF50; font-weight: bold',
    'color: #607D8B',
  )

  // eslint-disable-next-line no-console
  onLCP(console.log)
  // eslint-disable-next-line no-console
  onFCP(console.log)
  // eslint-disable-next-line no-console
  onFID(console.log)
}

const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)
init(app)

export { app }
