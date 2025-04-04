<template>
  <header
    v-if="$slots.header"
    class="header"
  >
    <slot name="header" />
  </header>

  <div class="app__wrapper">
    <main class="app__content">
      <slot />
    </main>
  </div>

  <footer
    v-if="$slots.footer"
    class="footer"
  >
    <slot name="footer" />
  </footer>
</template>
