<script setup lang="ts">
import { useRoute } from 'vue-router'
import { BaseFooter, BaseHeader, MainLayout } from '../app/layouts'

const route = useRoute()
const layout = computed(() => route.meta.layout || MainLayout)
</script>

<template>
  <div class="app">
    <component :is="layout">
      <template #header>
        <BaseHeader />
      </template>

      <template #default>
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </template>

      <template #footer>
        <BaseFooter />
      </template>
    </component>
  </div>
</template>

<style lang="scss">
@use "@/app/assets/styles/reset" as *;
@use "@/app/assets/styles/base" as *;
</style>
