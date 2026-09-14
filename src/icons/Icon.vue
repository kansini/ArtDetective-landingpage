<script setup lang="ts">
// 通用 SVG 图标容器 — 在 sections 中以 inline stroke 渲染，避开 emoji / 字体差异
defineProps<{
  size?: number | string
  stroke?: number
}>()
</script>

<template>
  <svg
    :width="size ?? 28"
    :height="size ?? 28"
    viewBox="0 0 24 24"
    fill="none"
    :stroke-width="stroke ?? 1.4"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <slot />
  </svg>
</template>
