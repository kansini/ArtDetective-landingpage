<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useLocaleStore } from '../composables/locale'
import Icon from '../icons/Icon.vue'
import { useGsapAnimations } from '../composables/useGsapAnimations'

const locale = useLocaleStore()
const t = computed(() => locale.messages.features)

// 每个功能的图标 (inline SVG，24x24 viewBox)
const icons = [
  // 碎片拾光: 拼图块
  `<path d="M4 5h6v3a2 2 0 0 0 4 0V5h6v6h-3a2 2 0 0 0 0 4h3v4h-6v-3a2 2 0 0 0-4 0v3H4v-4h3a2 2 0 0 0 0-4H4V5z"/>`,
  // 暗夜寻光: 聚光灯
  `<path d="M12 2v3M5 5l2 2M2 12h3M5 19l2-2M19 19l-2-2M22 12h-3M19 5l-2 2"/><circle cx="12" cy="12" r="4"/>`,
  // 多种挑战: 柱状图
  `<path d="M5 20V10M12 20V4M19 20v-7"/>`,
  // 作品故事: 翻开的书
  `<path d="M3 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3V5zM21 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8V5z"/>`,
  // 我的画廊: 画框
  `<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 14l4-4 4 4 3-3 5 5"/>`,
  // 艺术勋章: 星星徽章
  `<circle cx="12" cy="9" r="5"/><path d="M9 13l-2 7 5-3 5 3-2-7"/>`,
]

const root = ref<HTMLElement | null>(null)
const { revealUp, revealStagger } = useGsapAnimations()

onMounted(() => {
  // 标题 reveal
  revealUp(root.value!.querySelector('.features__header'), {})
  // 列表 stagger
  revealStagger(root.value!, '.feature')
})
</script>

<template>
  <section class="features" id="features" ref="root">
    <div class="container">
      <div class="features__header">
        <p class="eyebrow">FEATURES · 06</p>
        <h2 class="heading-section features__title">
          <span>让艺术</span>
          <span>触手可及。</span>
        </h2>
      </div>

      <ul class="features__grid">
        <li
          v-for="(item, i) in t.items"
          :key="i"
          class="feature"
        >
          <span class="feature__icon">
            <Icon :size="32" v-html="icons[i]" />
          </span>
          <h3 class="feature__title">{{ item.title }}</h3>
          <p class="feature__desc">{{ item.desc }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.features {
  padding: $sp-32 0;
  background: $color-bg;
  position: relative;

  @media (max-width: $bp-md) {
    padding: $sp-20 0;
  }

  &__header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto $sp-16;

    @media (max-width: $bp-md) {
      margin-bottom: $sp-10;
    }
  }

  &__title {
    margin-top: $sp-4;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
  }

  &__grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0;

    @media (max-width: $bp-lg) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: $bp-sm) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.feature {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: $sp-6 $sp-3;
  border-left: 1px solid $color-line;
  transition: background 0.4s $ease-out;

  &:last-child {
    border-right: 1px solid $color-line;
  }

  @media (max-width: $bp-lg) {
    &:nth-child(3n) {
      border-right: 1px solid $color-line;
    }
    &:nth-child(3n+1) {
      border-left: 1px solid $color-line;
    }
    &:nth-child(n+4) {
      border-top: 1px solid $color-line;
    }
  }

  @media (max-width: $bp-sm) {
    &:nth-child(odd) {
      border-left: 1px solid $color-line;
    }
    &:nth-child(even) {
      border-right: 1px solid $color-line;
    }
    &:nth-child(n+3) {
      border-top: 1px solid $color-line;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-ink;
    margin-bottom: $sp-6;
  }

  &__title {
    font-family: $font-serif;
    font-size: $fs-lg;
    font-weight: $fw-medium;
    color: $color-ink;
    margin-bottom: $sp-3;
    letter-spacing: 0;
  }

  &__desc {
    font-size: $fs-sm;
    color: $color-ink-soft;
    line-height: 1.7;
    white-space: pre-line;
  }
}
</style>
