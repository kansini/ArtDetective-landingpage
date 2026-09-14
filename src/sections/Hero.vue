<script setup lang="ts">
import { computed } from 'vue'
import { useLocaleStore } from '../composables/locale'
import Icon from '../icons/Icon.vue'
import phoneHome from '../assets/phone-home.png'
import phoneDetail from '../assets/phone-detail.png'

const locale = useLocaleStore()
const t = computed(() => locale.messages.hero)
</script>

<template>
  <section class="hero" id="home">
    <div class="hero__inner container">
      <!-- 左侧文字 -->
      <div class="hero__copy">
        <p class="hero__eyebrow eyebrow">{{ t.eyebrow }}</p>

        <h1 class="hero__title">
          <span class="hero__title-line">{{ t.title1 }}</span>
          <span class="hero__title-line">{{ t.title2 }}</span>
        </h1>

        <p class="hero__subtitle">{{ t.subtitle }}</p>

        <span class="hero__divider" aria-hidden="true"></span>

        <div class="hero__cta-row">
          <a class="cta hero__cta" href="#" @click.prevent>
            <Icon :size="18">
              <path d="M16.4 1.6c0 1.2-.5 2.4-1.4 3.2-.9.9-2 1.5-3.1 1.4-.1-1.2.4-2.4 1.3-3.2.9-.9 2.1-1.4 3.2-1.4zM20 17.3c-.6 1.3-.9 1.9-1.7 3.1-1.1 1.7-2.7 3.8-4.7 3.8-1.7 0-2.2-1.1-4.6-1.1-2.4 0-2.9 1.1-4.6 1.1-2 0-3.5-1.9-4.6-3.6C-.9 16.7-1.2 11.4.8 8.4c1.4-2.1 3.7-3.5 5.9-3.5 2.2 0 3.6 1.2 5.4 1.2 1.8 0 2.9-1.2 5.4-1.2 1.9 0 3.9 1 5.3 2.8-4.6 2.6-3.9 9.2-2.8 9.6z" />
            </Icon>
            <span>{{ t.cta.appStore }}</span>
          </a>
          <a class="cta cta--ghost hero__cta" href="#" @click.prevent>
            <Icon :size="18">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </Icon>
            <span>{{ t.cta.harmony }}</span>
          </a>
        </div>

        <p class="hero__platform">
          <span>{{ t.platformNote.ios }}</span>
          <span class="hero__platform-dot" aria-hidden="true"></span>
          <span>{{ t.platformNote.harmony }}</span>
        </p>

        <p class="hero__corner-label">
          <span v-for="line in t.cornerLabel" :key="line">{{ line }}</span>
        </p>
      </div>

      <!-- 右侧手机展示 -->
      <div class="hero__visual">
        <div class="hero__phone hero__phone--back">
          <img :src="phoneDetail" alt="Art Detective — Artwork Story" />
        </div>
        <div class="hero__phone hero__phone--front">
          <img :src="phoneHome" alt="Art Detective — Daily Masterpiece" />
        </div>

        <div class="hero__side" aria-hidden="true">
          <span v-for="(label, i) in t.sideLabel" :key="label" class="hero__side-label">
            {{ label }}<span v-if="i < t.sideLabel.length - 1" class="hero__side-sep">·</span>
          </span>
        </div>

        <p class="hero__pager">{{ t.pager }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.hero {
  position: relative;
  min-height: 100vh;
  padding: calc(#{$nav-height} + 32px) 0 80px;
  display: flex;
  align-items: center;
  overflow: hidden;

  &__inner {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: $sp-16;
    align-items: center;
    width: 100%;

    @media (max-width: $bp-lg) {
      grid-template-columns: 1fr 1fr;
      gap: $sp-10;
    }

    @media (max-width: $bp-md) {
      grid-template-columns: 1fr;
      gap: $sp-12;
      padding-top: $sp-8;
    }
  }

  &__copy {
    display: flex;
    flex-direction: column;
    gap: $sp-6;
    max-width: 520px;
  }

  &__eyebrow {
    margin-bottom: $sp-2;
  }

  &__title {
    font-family: $font-serif;
    font-size: clamp(40px, 5.6vw, 76px);
    line-height: 1.08;
    letter-spacing: -0.025em;
    color: $color-ink;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title-line {
    display: block;
    overflow: hidden;
  }

  &__subtitle {
    font-size: $fs-md;
    color: $color-ink-soft;
    line-height: 1.7;
    max-width: 420px;
    margin-top: $sp-3;
  }

  &__divider {
    display: block;
    width: 36px;
    height: 1px;
    background: $color-ink;
    margin: $sp-2 0;
  }

  &__cta-row {
    display: flex;
    gap: $sp-3;
    flex-wrap: wrap;
    margin-top: $sp-4;
  }

  &__cta {
    flex-shrink: 0;
  }

  &__platform {
    display: flex;
    align-items: center;
    gap: $sp-3;
    font-size: $fs-xs;
    color: $color-ink-muted;
    margin-top: $sp-2;
    flex-wrap: wrap;

    &-dot {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: $color-ink-muted;
      opacity: 0.5;
    }
  }

  &__corner-label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: $font-mono;
    font-size: $fs-xs;
    letter-spacing: $ls-widest;
    color: $color-ink-muted;
    margin-top: $sp-10;
    text-transform: uppercase;

    @media (max-width: $bp-md) {
      margin-top: $sp-6;
    }
  }

  // --- 右侧 visual ---------------------
  &__visual {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 560px;

    @media (max-width: $bp-md) {
      min-height: 480px;
    }
  }

  &__phone {
    position: absolute;
    width: 56%;
    max-width: 320px;
    display: block;
    will-change: transform;

    img {
      width: 100%;
      height: auto;        // 保持原图比例
      display: block;
      // 图本身就是带圆角 + 阴影的整张 mockup，不裁切、不变形
    }

    &--back {
      transform: translate(34%, -4%) rotate(7deg) scale(0.92);
      z-index: 1;
      opacity: 0.95;
    }

    &--front {
      transform: translate(-8%, 4%);
      z-index: 2;
    }
  }

  &__side {
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: right center;
    display: flex;
    align-items: center;
    gap: $sp-2;
    font-family: $font-mono;
    font-size: 10px;
    letter-spacing: $ls-widest;
    color: $color-ink-muted;
    white-space: nowrap;

    @media (max-width: $bp-md) {
      display: none;
    }
  }

  &__side-label {
    display: inline-flex;
    align-items: center;
    gap: $sp-2;
  }

  &__side-sep {
    opacity: 0.4;
  }

  &__pager {
    position: absolute;
    right: 0;
    bottom: 8%;
    font-family: $font-mono;
    font-size: 11px;
    letter-spacing: $ls-widest;
    color: $color-ink-soft;
    margin: 0;

    @media (max-width: $bp-md) {
      bottom: 0;
      right: 50%;
      transform: translateX(50%);
    }
  }
}
</style>
