<template>
  <slot name="header" />
  <div class="app__wrapper">
    <main class="app__content">
      <router-view />
    </main>
  </div>
  <slot name="footer" />
</template>
