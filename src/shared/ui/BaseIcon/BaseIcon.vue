<script lang="ts" setup>
import { getImageUrl, getSvgIcon } from '@/shared/utils/icons'

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  width: {
    type: String,
    default: '24',
  },
  height: {
    type: String,
    default: 'auto',
  },
  fill: {
    type: String,
    default: 'none',
  },
  type: {
    type: String,
    default: 'svg',
  },
})

const width = computed(() => {
  return props.size ? `${props.size}px` : `${props.width}px`
})
const height = computed(() => {
  return props.size ? `${props.size}px` : `${props.height}px`
})
</script>

<template>
  <i
    v-if="getSvgIcon(props.name)"
    class="icon"
    :data-name="props.name"
    :fill1="props.fill ?? 'currentColor'"
    stroke="currentColor"
    :style="{
      width,
      height,
      color: props.color,
    }"
    v-html="getSvgIcon(props.name)"
  />
  <img
    v-else
    :src="getImageUrl(props.name)"
    :data-name="props.name"
    :alt="props.name"
    :style="{
      width,
      height,
      minWidth: width,
      minHeight: height,
    }"
  >
</template>

<style lang="scss" src="./styles.scss" scoped></style>
