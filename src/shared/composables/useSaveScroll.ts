const historyPageScrollTop: Record<string, number> = reactive({})

export function useSaveScroll(delay = 0) {
  const route = useRoute()

  const saveScrollTop = (path: string, scrollTop: number) => {
    historyPageScrollTop[path] = scrollTop
  }

  const restoreScrollTop = () => {
    const scrollTop = historyPageScrollTop[route.fullPath] || 0
    window.scrollTo(0, scrollTop)
  }

  const delayedRestoreScrollTop = () => {
    setTimeout(restoreScrollTop, delay)
  }

  onActivated(() => {
    delayedRestoreScrollTop()
  })

  onMounted(() => {
    delayedRestoreScrollTop()
  })

  onBeforeRouteLeave((_, from, next) => {
    const scrollTop = Math.max(
      window.scrollY,
      document.documentElement.scrollTop,
      document.body.scrollTop,
    )
    saveScrollTop(from.fullPath, scrollTop)
    next()
  })

  return { restoreScrollTop }
}
