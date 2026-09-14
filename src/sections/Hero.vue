<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocaleStore } from '../composables/locale'
import { playHeroIntro } from '../composables/useGsapAnimations'
import QrPopover from '../components/QrPopover.vue'
import phoneHome from '../assets/phone-home.png'
import phoneDetail from '../assets/phone-detail.png'
import qrApple from '../assets/qr-apple.png'
import qrHm from '../assets/qr-hm.png'

gsap.registerPlugin(ScrollTrigger)

const locale = useLocaleStore()
const t = computed(() => locale.messages.hero)

const showApple = ref(false)
const showHarmony = ref(false)
const appleBtn = ref<HTMLElement | null>(null)
const harmonyBtn = ref<HTMLElement | null>(null)

let heroScrollTrigger: ScrollTrigger | null = null

onMounted(() => {
  // 1) 入场动画 (load)
  playHeroIntro()

  // 2) 跟随页面滚动 — Apple 风格视差 + 缩入
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    },
  })

  // 左文: 快速上移 + 淡出
  tl.to('.hero__copy', { y: -120, autoAlpha: 0, ease: 'none' }, 0)
  tl.to(
    '.hero__cta-row, .hero__platform, .hero__divider',
    { y: -80, autoAlpha: 0, ease: 'none' },
    0,
  )
  tl.to('.hero__extra, .hero__divider--bottom', { autoAlpha: 0, y: -40, ease: 'none' }, 0.15)

  // 前置 phone: 视差慢速 + 缩小
  tl.to(
    '.hero__phone--front',
    { y: -180, scale: 0.82, ease: 'none' },
    0,
  )
  // 后置 phone: 滚得更快 + 缩得更小
  tl.to(
    '.hero__phone--back',
    { y: -280, scale: 0.65, ease: 'none' },
    0,
  )

  // 右侧文字标签 + pager 淡出
  tl.to(
    ['.hero__side', '.hero__pager'],
    { autoAlpha: 0, y: -40, ease: 'none' },
    0.1,
  )
  // 整块 visual 容器淡出 (避免 phone 移走后留白)
  tl.to('.hero__visual', { autoAlpha: 0, ease: 'none' }, 0.4)

  heroScrollTrigger = tl.scrollTrigger ?? null
})

onBeforeUnmount(() => {
  heroScrollTrigger?.kill()
})
</script>

<template>
  <section class="hero" id="home">
    <div class="hero__inner container">
      <!-- 左侧文字 -->
      <div class="hero__copy">
        <p class="hero__eyebrow eyebrow" style="white-space: pre-line;">{{ t.eyebrow }}</p>

        <h1 class="hero__title">
          <span class="hero__title-line">{{ t.title1 }}</span>
          <span class="hero__title-line">{{ t.title2 }}</span>
        </h1>

        <p class="hero__subtitle">{{ t.subtitle }}</p>

        <span class="hero__divider" aria-hidden="true"></span>

        <div class="hero__cta-row cta-row">
          <button
            ref="appleBtn"
            class="cta hero__cta"
            type="button"
            data-qr-trigger
            @click="showApple = !showApple; showHarmony = false"
          >
            <svg width="40" height="48" viewBox="0 0 24 48" fill="none" stroke-width="1.4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
                <path d="m15.5752 19.0792a4.2055 4.2055 0 0 0 -2.01 3.5376 4.0931 4.0931 0 0 0 2.4908 3.7542 9.7779 9.7779 0 0 1 -1.2755 2.6351c-.7941 1.1431-1.6244 2.2862-2.8878 2.2862s-1.5883-.734-3.0443-.734c-1.42 0-1.9252.7581-3.08.7581s-1.9611-1.0589-2.8876-2.3584a11.3987 11.3987 0 0 1 -1.9373-6.1487c0-3.61 2.3464-5.523 4.6566-5.523 1.2274 0 2.25.8062 3.02.8062.734 0 1.8771-.8543 3.2729-.8543a4.3778 4.3778 0 0 1 3.6822 1.841zm-6.8586-2.0456a1.3865 1.3865 0 0 1 -.2527-.024 1.6557 1.6557 0 0 1 -.0361-.337 4.0341 4.0341 0 0 1 1.0228-2.5148 4.1571 4.1571 0 0 1 2.7314-1.4078 1.7815 1.7815 0 0 1 .0361.373 4.1487 4.1487 0 0 1 -.9867 2.587 3.6039 3.6039 0 0 1 -2.5148 1.3236z"></path>
              </svg>
            </svg>
            <span>{{ t.cta.appStore }}</span>
          </button>

          <button
            ref="harmonyBtn"
            class="cta cta--ghost hero__cta"
            type="button"
            data-qr-trigger
            @click="showHarmony = !showHarmony; showApple = false"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="1.4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>{{ t.cta.harmony }}</span>
          </button>

          <QrPopover
            :open="showApple"
            :qr-src="qrApple"
            :title="t.cta.appStore"
            hint="使用 iPhone 相机扫描"
            align="start"
            :anchor="appleBtn"
            @close="showApple = false"
          />
          <QrPopover
            :open="showHarmony"
            :qr-src="qrHm"
            :title="t.cta.harmony"
            hint="使用 HarmonyOS 相机扫描"
            align="end"
            :anchor="harmonyBtn"
            @close="showHarmony = false"
          />
        </div>

        <p class="hero__platform">
          <span>{{ t.platformNote.ios }}</span>
          <span class="hero__platform-dot" aria-hidden="true"></span>
          <span>{{ t.platformNote.harmony }}</span>
        </p>

        <span class="hero__divider hero__divider--bottom" aria-hidden="true"></span>

        <p class="hero__extra">{{ t.extra }}</p>
      </div>

      <!-- 右侧手机展示 -->
      <div class="hero__visual">
        <div class="hero__phone hero__phone--back">
          <img :src="phoneHome" alt="Art Detective — Artwork Story" />
        </div>
        <div class="hero__phone hero__phone--front">
          <img :src="phoneDetail" alt="Art Detective — Daily Masterpiece" />
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
      gap: $sp-10;
      padding-top: $sp-4;
    }
  }

  &__copy {
    display: flex;
    flex-direction: column;
    gap: $sp-6;
    max-width: 520px;

    @media (max-width: $bp-md) {
      gap: $sp-4;
      max-width: 100%;
      text-align: left;
    }
  }

  &__eyebrow {
    margin-bottom: $sp-2;
  }

  &__title {
    font-family: $font-serif;
    font-size: clamp(36px, 5.6vw, 76px);
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
    // 移动端布局统一由 .cta-row 全局类处理
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

  &__divider--bottom {
    margin-top: $sp-6;
  }

  &__extra {
    font-size: $fs-sm;
    color: $color-ink-soft;
    line-height: 1.7;
    max-width: 240px;
    white-space: pre-line;
    margin-top: $sp-2;

    @media (max-width: $bp-md) {
      max-width: 100%;
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
      min-height: 380px;
      order: 2;
    }

    @media (max-width: $bp-sm) {
      min-height: 320px;
    }
  }

  &__phone {
    position: absolute;
    width: 100%;
    max-width: 360px;
    display: block;
    will-change: transform;

    @media (max-width: $bp-sm) {
      max-width: 240px;
    }

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
