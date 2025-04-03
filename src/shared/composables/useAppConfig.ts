interface LocalStorageData {
  isDarkTheme?: boolean
}

const isDrawerOpen: Ref<boolean> = ref(false)
const isDarkTheme: Ref<boolean> = ref(false)
const showHeader: Ref<boolean> = ref(true)
const minimizeFooter: Ref<boolean> = ref(false)

function applyTheme(): void {
  document.documentElement.classList.toggle('dark', isDarkTheme.value)
}

function initializeTheme(): void {
  try {
    const savedData = localStorage.getItem('my-project-data')
    // eslint-disable-next-line ts/no-unsafe-assignment, ts/strict-boolean-expressions
    const LSdata: LocalStorageData = savedData ? JSON.parse(savedData) : {}

    if (LSdata.isDarkTheme === undefined) {
      isDarkTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    else {
      isDarkTheme.value = LSdata.isDarkTheme
    }
  }
  catch (error) {
    console.error('Error initializing theme:', error)
  }
}

// Инициализация темы
if (typeof window !== 'undefined') {
  setTimeout(initializeTheme, 0)
}

// Автоматическое сохранение темы при изменении
watch(isDarkTheme, (newValue) => {
  applyTheme()

  try {
    // eslint-disable-next-line ts/no-unsafe-assignment, ts/strict-boolean-expressions
    const currentData = JSON.parse(localStorage.getItem('my-project-data') || '{}')
    localStorage.setItem('my-project-data', JSON.stringify({
      ...currentData,
      isDarkTheme: newValue,
    }))
  }
  catch (error) {
    console.error('Error saving theme preference:', error)
  }
})

export function useAppConfig() {
  function closeDrawer(): void {
    isDrawerOpen.value = false
  }

  return {
    isDrawerOpen,
    isDarkTheme,
    showHeader,
    minimizeFooter,
    closeDrawer,
  }
}
