/**
 * Custom `useLocalStorage` implementation
 * It can observe any reactive variable with a two-way mapping of its value to window.localStorage
 *
 * Usage:
 *
 * import { useLocalStorage } from "@/composables/useLocalStorage";
 * const ls = useLocalStorage();
 *
 * ls.init();
 * ls.observe("isDarkTheme", isDarkTheme);
 *
 */

const LS_KEY = 'my-project-data'

type StorageValue = string | number | boolean | object | any[] | Set<any> | null
type StorageData = Record<string, StorageValue>
type Observable<T> = Ref<T> | { value: T }

// Наблюдаемые реактивные данные
const data: StorageData = reactive<StorageData>({})

/**
 * Инициализирует хук, добавляя обработчик события storage
 */
function init(): void {
  readFromStorage()
  window.addEventListener('storage', handleStorageEvent)
}

function handleStorageEvent(e: StorageEvent): void {
  if (e.key === LS_KEY) {
    readFromStorage()
  }
}

/**
 * Читает данные из localStorage и обновляет реактивный объект
 */
function readFromStorage(): void {
  try {
    const rawData = localStorage.getItem(LS_KEY)
    // eslint-disable-next-line ts/strict-boolean-expressions, ts/no-unsafe-assignment
    const lsData: StorageData = rawData ? JSON.parse(rawData) : {}

    Object.entries(lsData).forEach(([key, value]) => {
      data[key] = (Array.isArray(value) && data[key] instanceof Set)
        ? new Set(value)
        : value
    })
  }
  catch (error) {
    console.error('Failed to read from localStorage:', error)
  }
}

/**
 * Наблюдает за изменениями данных и сохраняет в localStorage
 */
watch(data, () => {
  try {
    const decomposedData: Record<string, any> = {}

    Object.keys(data).forEach((key) => {
      decomposedData[key] = data[key] instanceof Set
        ? Array.from(data[key])
        : data[key]
    })

    localStorage.setItem(LS_KEY, JSON.stringify(decomposedData))
  }
  catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}, { deep: true })

/**
 * Подписывается на изменения ключа в хранилище
 * @param key Ключ для наблюдения
 * @param observable Реактивная ссылка или объект с value
 */
function observe<T extends StorageValue>(key: string, observable: Observable<T>): void {
  // Инициализация текущим значением
  const initialValue = data[key] as T | undefined

  if (initialValue !== undefined) {
    if (initialValue instanceof Set && 'value' in observable && observable.value instanceof Set) {
      observable.value = new Set(initialValue) as T
    }
    else {
      observable.value = initialValue
    }
  }

  // Сохраняем ссылку на observable
  data[key] = observable.value
}

export function useLocalStorage() {
  return {
    init,
    observe,
  }
}
