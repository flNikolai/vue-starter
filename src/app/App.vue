<script setup lang="ts">
import { MainLayout } from '@/shared/ui/layouts'

const route = useRoute()

const layout = computed(() => route.meta.layout || MainLayout)
</script>

<template>
  <div class="app">
    <component :is="layout">
      <template #header>
        Header
      </template>

      <template #default>
        <router-view />
      </template>

      <template #footer>
        Footer
      </template>
    </component>
  </div>
</template>

<style lang="scss">
@use "@/app/assets/styles/reset" as *;
@use "@/app/assets/styles/base" as *;
</style>
