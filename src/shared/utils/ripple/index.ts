// eslint-disable-next-line import-fsd/no-denied-layers
import './styles.css'

interface RippleValue {
  class?: string
  center?: boolean
}

interface RippleOptions {
  enabled?: boolean
  centered?: boolean
  circle?: boolean
  class?: string
  touched?: boolean
  isTouch?: boolean
  showTimer?: number
  showTimerCommit?: () => void
}

declare global {
  interface HTMLElement {
    _ripple?: RippleOptions
  }
}

interface EventWithSymbol extends Event {
  // eslint-disable-next-line ts/no-use-before-define
  [stopSymbol]?: boolean
}

interface KeyboardEventWithSymbol extends KeyboardEvent, EventWithSymbol {}
interface MouseEventWithSymbol extends MouseEvent, EventWithSymbol {}
interface TouchEventWithSymbol extends TouchEvent, EventWithSymbol {}

// Utils
function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}

const keyCodes = Object.freeze({
  enter: 13,
  tab: 9,
  delete: 46,
  esc: 27,
  space: 32,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  end: 35,
  home: 36,
  del: 46,
  backspace: 8,
  insert: 45,
  pageup: 33,
  pagedown: 34,
  shift: 16,
} as const)

const stopSymbol = Symbol('rippleStop')
const DELAY_RIPPLE = 80

function transform(el: HTMLSpanElement, value: string): void {
  el.style.transform = value
  el.style.webkitTransform = value
}

function isTouchEvent(e: Event): e is TouchEventWithSymbol {
  return 'touches' in e
}

function isKeyboardEvent(e: Event): e is KeyboardEventWithSymbol {
  return 'keyCode' in e
}

interface RipplePosition {
  radius: number
  scale: number
  x: string
  y: string
  centerX: string
  centerY: string
}

function calculate(
  e: MouseEventWithSymbol | TouchEventWithSymbol | KeyboardEventWithSymbol,
  el: HTMLElement & { _ripple?: RippleOptions },
  value: RippleValue = {},
): RipplePosition {
  let localX = 0
  let localY = 0

  if (!isKeyboardEvent(e)) {
    const offset = el.getBoundingClientRect()
    const target = isTouchEvent(e) ? e.touches[e.touches.length - 1] : e

    localX = target.clientX - offset.left
    localY = target.clientY - offset.top
  }

  let radius = 0
  let scale = 0.3
  if (el._ripple?.circle) {
    scale = 0.15
    radius = el.clientWidth / 2
    radius = value.center
      ? radius
      : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4
  }
  else {
    radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2
  }

  const centerX = `${(el.clientWidth - radius * 2) / 2}px`
  const centerY = `${(el.clientHeight - radius * 2) / 2}px`

  const x = value.center ? centerX : `${localX - radius}px`
  const y = value.center ? centerY : `${localY - radius}px`

  return { radius, scale, x, y, centerX, centerY }
}

const ripples = {
  show(
    e: MouseEventWithSymbol | TouchEventWithSymbol | KeyboardEventWithSymbol,
    el: HTMLElement & { _ripple?: RippleOptions },
    value: RippleValue = {},
  ): void {
    if (!el?._ripple?.enabled) {
      return
    }

    const container = document.createElement('span')
    const animation = document.createElement('span')

    container.appendChild(animation)
    container.className = 'v-ripple__container'

    if (typeof value.class === 'string') {
      container.className += ` ${value.class}`
    }

    const { radius, scale, x, y, centerX, centerY } = calculate(e, el, value)

    const size = `${radius * 2}px`
    animation.className = 'v-ripple__animation'
    animation.style.width = size
    animation.style.height = size

    el.appendChild(container)

    const computed = window.getComputedStyle(el)
    // eslint-disable-next-line ts/strict-boolean-expressions
    if (computed && computed.position === 'static') {
      el.style.position = 'relative'
      el.dataset.previousPosition = 'static'
    }

    animation.classList.add('v-ripple__animation--enter')
    animation.classList.add('v-ripple__animation--visible')
    transform(animation, `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`)
    animation.dataset.activated = String(performance.now())

    setTimeout(() => {
      animation.classList.remove('v-ripple__animation--enter')
      animation.classList.add('v-ripple__animation--in')
      transform(animation, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`)
    }, 0)
  },

  hide(el: HTMLElement & { _ripple?: RippleOptions }): void {
    if (!el?._ripple?.enabled) {
      return
    }

    const ripples = el.getElementsByClassName('v-ripple__animation')
    if (ripples.length === 0) {
      return
    }

    const animation = ripples[ripples.length - 1] as HTMLElement
    // eslint-disable-next-line ts/strict-boolean-expressions
    if (animation.dataset.isHiding) {
      return
    }

    animation.dataset.isHiding = 'true'

    const diff = performance.now() - Number(animation.dataset.activated)
    const delay = Math.max(250 - diff, 0)

    setTimeout(() => {
      animation.classList.remove('v-ripple__animation--in')
      animation.classList.add('v-ripple__animation--out')

      setTimeout(() => {
        const ripples = el.getElementsByClassName('v-ripple__animation')
        if (ripples.length === 1 && 'previousPosition' in el.dataset) {
          el.style.position = el.dataset.previousPosition as string
          delete el.dataset.previousPosition
        }

        if (animation.parentNode?.parentNode === el) {
          el.removeChild(animation.parentNode)
        }
      }, 300)
    }, delay)
  },
}

function isRippleEnabled(value: unknown): value is RippleValue {
  return isObject(value) || typeof value === 'boolean' || typeof value === 'undefined'
}

function rippleShow(e: MouseEventWithSymbol | TouchEventWithSymbol | KeyboardEventWithSymbol): void {
  const value: RippleValue = {}
  const element = e.currentTarget as HTMLElement & { _ripple?: RippleOptions }

  if (!element?._ripple || element._ripple.touched || e[stopSymbol]) {
    return
  }

  e[stopSymbol] = true

  if (isTouchEvent(e)) {
    element._ripple.touched = true
    element._ripple.isTouch = true
  }
  else if (element._ripple.isTouch) {
    return
  }

  value.center = element._ripple.centered || isKeyboardEvent(e)
  // eslint-disable-next-line ts/strict-boolean-expressions
  if (element._ripple.class) {
    value.class = element._ripple.class
  }

  if (isTouchEvent(e)) {
    if (element._ripple.showTimerCommit) {
      return
    }

    element._ripple.showTimerCommit = () => {
      ripples.show(e, element, value)
    }
    element._ripple.showTimer = window.setTimeout(() => {
      if (element?._ripple?.showTimerCommit) {
        element._ripple.showTimerCommit()
        element._ripple.showTimerCommit = undefined
      }
    }, DELAY_RIPPLE)
  }
  else {
    ripples.show(e, element, value)
  }
}

function rippleStop(e: EventWithSymbol): void {
  e[stopSymbol] = true
}

function rippleHide(e: EventWithSymbol): void {
  const element = e.currentTarget as HTMLElement & { _ripple?: RippleOptions }
  if (!element?._ripple) {
    return
  }

  window.clearTimeout(element._ripple.showTimer)

  if (e.type === 'touchend' && element._ripple.showTimerCommit) {
    element._ripple.showTimerCommit()
    element._ripple.showTimerCommit = undefined
    element._ripple.showTimer = window.setTimeout(() => rippleHide(e))
    return
  }

  window.setTimeout(() => {
    if (element._ripple) {
      element._ripple.touched = false
    }
  })
  ripples.hide(element)
}

function rippleCancelShow(e: EventWithSymbol): void {
  const element = e.currentTarget as HTMLElement & { _ripple?: RippleOptions }
  if (!element?._ripple) {
    return
  }

  if (element._ripple.showTimerCommit) {
    element._ripple.showTimerCommit = undefined
  }

  window.clearTimeout(element._ripple.showTimer)
}

let keyboardRipple = false

function keyboardRippleShow(e: KeyboardEventWithSymbol): void {
  if (!keyboardRipple && (e.keyCode === keyCodes.enter || e.keyCode === keyCodes.space)) {
    keyboardRipple = true
    rippleShow(e)
  }
}

function keyboardRippleHide(e: KeyboardEventWithSymbol): void {
  keyboardRipple = false
  rippleHide(e)
}

function focusRippleHide(e: FocusEvent): void {
  if (keyboardRipple) {
    keyboardRipple = false
    rippleHide(e as EventWithSymbol)
  }
}

function updateRipple(
  el: HTMLElement,
  binding: { value: unknown, modifiers: { center?: boolean, circle?: boolean, stop?: boolean } },
  wasEnabled: boolean,
): void {
  const { value, modifiers } = binding
  const enabled = isRippleEnabled(value)

  if (!enabled) {
    ripples.hide(el)
  }

  el._ripple = el._ripple ?? ({} as RippleOptions)
  el._ripple.enabled = enabled
  el._ripple.centered = modifiers.center
  el._ripple.circle = modifiers.circle

  if (isObject(value) && 'class' in value && typeof value.class === 'string') {
    el._ripple.class = value.class
  }

  if (enabled && !wasEnabled) {
    if (modifiers.stop) {
      el.addEventListener('touchstart', rippleStop, { passive: true })
      el.addEventListener('mousedown', rippleStop)
      return
    }

    el.addEventListener('touchstart', rippleShow, { passive: true })
    el.addEventListener('touchend', rippleHide, { passive: true })
    el.addEventListener('touchmove', rippleCancelShow, { passive: true })
    el.addEventListener('touchcancel', rippleHide)
    el.addEventListener('mousedown', rippleShow)
    el.addEventListener('mouseup', rippleHide)
    el.addEventListener('mouseleave', rippleHide)
    el.addEventListener('keydown', keyboardRippleShow)
    el.addEventListener('keyup', keyboardRippleHide)
    el.addEventListener('blur', focusRippleHide)
    el.addEventListener('dragstart', rippleHide, { passive: true })
  }
  else if (!enabled && wasEnabled) {
    removeListeners(el)
  }
}

function removeListeners(el: HTMLElement): void {
  el.removeEventListener('mousedown', rippleShow)
  el.removeEventListener('touchstart', rippleShow)
  el.removeEventListener('touchend', rippleHide)
  el.removeEventListener('touchmove', rippleCancelShow)
  el.removeEventListener('touchcancel', rippleHide)
  el.removeEventListener('mouseup', rippleHide)
  el.removeEventListener('mouseleave', rippleHide)
  el.removeEventListener('keydown', keyboardRippleShow)
  el.removeEventListener('keyup', keyboardRippleHide)
  el.removeEventListener('dragstart', rippleHide)
  el.removeEventListener('blur', focusRippleHide)
}

function mounted(el: HTMLElement, binding: { value: unknown, modifiers: Record<string, boolean> }): void {
  updateRipple(el, binding, false)
}

function unmounted(el: HTMLElement): void {
  delete el._ripple
  removeListeners(el)
}

function updated(
  el: HTMLElement,
  binding: { value: unknown, oldValue: unknown, modifiers: Record<string, boolean> },
): void {
  if (binding.value === binding.oldValue) {
    return
  }

  const wasEnabled = isRippleEnabled(binding.oldValue)
  updateRipple(el, binding, wasEnabled)
}

export const Ripple = {
  mounted,
  unmounted,
  updated,
}

export default Ripple
