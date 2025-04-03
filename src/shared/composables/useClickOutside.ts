type Fn = () => void
type EventListenerOptions = boolean | AddEventListenerOptions
type ClickOutsideCallback = (event: Event) => void
type MaybeElementRef = MaybeRef<HTMLElement | SVGElement | null | undefined>

const EVENTS = ['mousedown', 'touchstart', 'pointerdown'] as const

function unrefElement(elRef: MaybeElementRef | { $el?: HTMLElement | SVGElement }): HTMLElement | SVGElement | null {
  const plain = unref(elRef as MaybeRef<unknown>)
  return (plain as { $el?: HTMLElement | SVGElement })?.$el ?? (plain as HTMLElement | SVGElement | null)
}

function useEventListener(
  target: MaybeRef<EventTarget | null | undefined>,
  event: string,
  listener: EventListener,
  options?: EventListenerOptions,
): Fn {
  if (!target) {
    return () => {}
  }

  let cleanup: Fn = () => {}

  watch(
    () => unref(target),
    (el) => {
      cleanup()

      if (!el) {
        return
      }

      el.addEventListener(event, listener, options)

      cleanup = () => {
        el.removeEventListener(event, listener, options)
        cleanup = () => {}
      }
    },
    { immediate: true },
  )

  onUnmounted(cleanup)

  return cleanup
}

export function useClickOutside() {
  function onClickOutside(
    target: MaybeElementRef,
    callback: ClickOutsideCallback,
  ): Fn {
    const listener = (event: Event) => {
      const el = unrefElement(target)
      if (!el) {
        return
      }

      if (el === event.target || event.composedPath().includes(el)) {
        return
      }

      callback(event)
    }

    let disposables: Fn[] = EVENTS.map(event =>
      useEventListener(window, event, listener, { passive: true }),
    )

    const stop: Fn = () => {
      disposables.forEach(dispose => dispose())
      disposables = []
    }

    onUnmounted(stop)

    return stop
  }

  return {
    onClickOutside,
  }
}
