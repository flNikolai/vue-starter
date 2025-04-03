function useToggle(initialValue: boolean = false): [Ref<boolean>, () => void] {
  const state = ref(initialValue)

  const toggle = () => {
    state.value = !state.value
  }

  return [state, toggle]
}

// Определяем тип для функции fn
type AsyncFn<Args extends any[], ReturnType> = (...args: Args) => Promise<ReturnType>

/**
 *
 * const Fn = useLockFn(async (key) => {
 *  console.log(key)
 * }
 *
 * <div v-on:click="Fn(123)"></div>
 * ```
 */
export function useLockFn<Args extends any[], ReturnType>(
  fn: AsyncFn<Args, ReturnType>,
  autoUnlock: boolean | 'auto' = 'auto',
) {
  const [lock, toggleLock] = useToggle(false)

  return async (...args: Args): Promise<ReturnType | void> => {
    if (lock.value) {
      return
    }
    toggleLock()
    try {
      const $return: ReturnType = await fn(...args)
      if (autoUnlock === true || (autoUnlock === 'auto' && $return !== false)) {
        toggleLock()
      }
      return $return
    }
    catch (e) {
      toggleLock()
      throw e
    }
  }
}
