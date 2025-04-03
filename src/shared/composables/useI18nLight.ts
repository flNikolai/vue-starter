/* eslint-disable style/max-statements-per-line */
import enLocale from '@/app/assets/locales/en.json'
import ruLocale from '@/app/assets/locales/ru.json'

// Типы для локалей
interface Locale {
  code: string
  name: string
  flag?: string
}

interface Messages {
  [key: string]: unknown
}

interface I18nReturn {
  t: (msg: string, params?: Record<string, string>) => string
  locale: Ref<Locale>
  locales: Locale[]
  setLocale: (code: string) => Promise<void>
  initI18n: () => Promise<void>
}

const locales: Locale[] = [
  {
    code: 'en',
    name: 'English',
    flag: '/images/lang/lang-en.png',
  },
  {
    code: 'ru',
    name: 'Русский',
    flag: '/images/lang/lang-ru.png',
  },
]

// Сообщения
const messages: Record<string, Messages> = {
  en: enLocale,
  ru: ruLocale,
}

// Текущая локаль
const locale: Ref<Locale> = ref(locales[0])

export function useI18n(): I18nReturn {
  async function initI18n(): Promise<void> {
    const storedLang = localStorage.getItem('vue-webapp_lang')
    const defaultLang = typeof import.meta.env.VITE_APP_DEFAULT_LOCALE === 'string'
      ? import.meta.env.VITE_APP_DEFAULT_LOCALE
      : null
    const code = storedLang ?? defaultLang ?? 'en'

    if (typeof code === 'string') {
      await setLocale(code)
    }
  }

  async function setLocale(code: string): Promise<void> {
    if (locale.value.code !== code) {
      const foundLocale = locales.find(l => l.code === code)
      if (foundLocale) {
        locale.value = foundLocale
        localStorage.setItem('vue-webapp_lang', locale.value.code)
      }
    }
  }

  function t(msg: string, params: Record<string, string> = {}): string {
    if (typeof msg !== 'string' || msg.trim().length === 0) { return '' }

    const currentLocale = locale.value
    if (!currentLocale?.code) { return msg }

    const currentMessages = messages[currentLocale.code]

    const value = msg.trim().split('.').reduce<unknown>((val, part) => {
      // eslint-disable-next-line ts/strict-boolean-expressions
      if (val && typeof val === 'object' && !Array.isArray(val) && part in val) {
        return (val as Record<string, unknown>)[part]
      }
      return null
    }, currentMessages)

    if (typeof value !== 'string') { return msg }

    return Object.entries(params).reduce((result, [key, val]) => {
      return result.replace(new RegExp(`\\{${key}\\}`, 'g'), val)
    }, value)
  }

  return {
    t,
    locale,
    locales,
    setLocale,
    initI18n,
  }
}
