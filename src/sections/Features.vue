<script setup lang="ts">
import {computed, ref, onMounted} from 'vue'
import {useLocaleStore} from '../composables/locale'
import {useGsapAnimations} from '../composables/useGsapAnimations'

const locale = useLocaleStore()
const t = computed(() => locale.messages.features)

const root = ref<HTMLElement | null>(null)
const {revealUp, revealStagger} = useGsapAnimations()

// 6 个图标 (inline SVG, 24x24 viewBox)
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

onMounted(() => {
  revealUp(root.value!.querySelector('.features__header') as Element, {})
  revealStagger(root.value!, '.feature-card')
})
</script>

<template>
  <section class="features" id="features" ref="root">
    <div class="container">
      <div class="features__header">
        <div class="features__head-text">
          <h2 class="features__title">{{ t.title }}</h2>
          <p class="features__subtitle">{{ t.subtitle }}</p>
        </div>
        <p class="features__eyebrow">{{ t.eyebrow }}</p>
      </div>

      <ul class="features__grid">
        <li
            v-for="(item, i) in t.items"
            :key="i"
            class="feature-card"
        >
          <div class="feature-card__body">
            <span class="feature-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
                   stroke-linejoin="round" v-html="icons[i]"/>
            </span>
            <h3 class="feature-card__title">{{ item.title }}</h3>
            <p class="feature-card__desc">{{ item.desc }}</p>
            <a class="feature-card__more" href="#">
              {{ t.more }}
              <span class="feature-card__arrow" aria-hidden="true">→</span>
            </a>
          </div>
          <div class="feature-card__visual">
            <img :src="`./features/${i}.png`" alt="">
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.features {
  padding: $sp-32 0 $sp-24;
  background: $color-bg;
  position: relative;

  @media (max-width: $bp-md) {
    padding: $sp-20 0;
  }

  &__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: $sp-8;
    margin-bottom: $sp-16;

    @media (max-width: $bp-md) {
      flex-direction: column;
      align-items: flex-start;
      gap: $sp-4;
      margin-bottom: $sp-10;
    }
  }

  &__head-text {
    display: flex;
    flex-direction: column;
    gap: $sp-3;
  }

  &__title {
    font-family: $font-serif;
    font-size: clamp(32px, 4vw, 48px);
    font-weight: $fw-medium;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: $color-ink;
    margin: 0;
  }

  &__subtitle {
    font-size: $fs-md;
    color: $color-ink-soft;
    margin: 0;
  }

  &__eyebrow {
    font-family: $font-mono;
    font-size: $fs-xs;
    font-weight: $fw-regular;
    letter-spacing: $ls-widest;
    text-transform: uppercase;
    color: $color-ink-muted;
    margin: 0;
    padding-bottom: $sp-3;

    @media (max-width: $bp-md) {
      padding-bottom: 0;
    }
  }

  &__grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $sp-4;

    @media (max-width: $bp-lg) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: $bp-sm) {
      grid-template-columns: 1fr;
    }
  }
}

.feature-card {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  background: $color-surface;
  border: 1px solid $color-line;
  border-radius: $radius-lg;
  overflow: hidden;
  min-height: 280px;
  transition: transform 0.5s $ease-out, box-shadow 0.5s $ease-out, border-color 0.5s $ease-out;

  @media (max-width: $bp-sm) {
    min-height: 220px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;
    border-color: rgba(26, 23, 20, 0.12);
  }

  // 文字占 1/2 (左)
  &__body {
    display: flex;
    flex-direction: column;
    gap: $sp-3;
    padding: $sp-6 $sp-5;
    z-index: 1;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: $color-ink;

    svg {
      width: 28px;
      height: 28px;
    }
  }

  &__title {
    font-family: $font-serif;
    font-size: $fs-xl;
    font-weight: $fw-medium;
    line-height: 1.2;
    color: $color-ink;
    margin: 0;
    letter-spacing: 0;
  }

  &__desc {
    font-size: $fs-sm;
    line-height: 1.7;
    color: $color-ink-soft;
    white-space: pre-line;
    margin: 0;
    flex: 1;
  }

  &__more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: $fs-sm;
    color: $color-ink;
    margin-top: $sp-2;
    transition: gap 0.3s $ease-out, color 0.3s $ease-out;

    .feature-card__arrow {
      transition: transform 0.3s $ease-out;
    }

    &:hover {
      color: $color-accent-hover;
      gap: 10px;

      .feature-card__arrow {
        transform: translateX(2px);
      }
    }
  }

  // 图占 1/2 (右)
  &__visual {
    position: relative;
    overflow: hidden;
    background: $color-bg-alt;

    img {
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
