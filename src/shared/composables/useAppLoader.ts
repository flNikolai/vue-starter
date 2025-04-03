const loaderSet = reactive(new Set<string>())
const loading: ComputedRef<boolean> = computed(() => loaderSet.size > 0)

interface AppLoaderReturn {
  loading: ComputedRef<boolean>
  startLoading: () => void
  stopLoading: () => void
}

export function useAppLoader(id: string): AppLoaderReturn {
  function startLoading(): void {
    loaderSet.add(id)
  }

  function stopLoading(): void {
    loaderSet.delete(id)
  }

  return {
    loading,
    startLoading,
    stopLoading,
  }
}
