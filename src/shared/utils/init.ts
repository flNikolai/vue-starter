import type { Directive } from 'vue'

// import { http } from '@/shared/api'
import { useAppConfig } from '@/shared/composables/useAppConfig'
import { useI18n } from '@/shared/composables/useI18nLight'
import { useLocalStorage } from '@/shared/composables/useLocalStorage'
import { loadIcons } from '@/shared/utils/icons'
import { Ripple } from '@/shared/utils/ripple'

const { initI18n } = useI18n()
const { isDarkTheme } = useAppConfig()
const ls = useLocalStorage()

const rippleDirective: Directive = Ripple

export function init(app?: any) {
  ls.init()
  ls.observe('isDarkTheme', isDarkTheme)

  loadIcons()
  // http.init()

  void initI18n()

  // eslint-disable-next-line ts/strict-boolean-expressions
  if (app) {
    // eslint-disable-next-line ts/no-unsafe-call, ts/no-unsafe-member-access
    app.directive('Ripple', rippleDirective)
  }
}
