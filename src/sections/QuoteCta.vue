<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useLocaleStore } from '../composables/locale'
import { useGsapAnimations } from '../composables/useGsapAnimations'
import QrPopover from '../components/QrPopover.vue'
import qrApple from '../assets/qr-apple.png'
import qrHm from '../assets/qr-hm.png'
import harmonyIcon from '../assets/harmony-icon.svg'

const locale = useLocaleStore()
const t = computed(() => {
  const m = locale.messages
  return { quote: m.quote, finalCta: m.finalCta }
})

const root = ref<HTMLElement | null>(null)
const { revealUp, revealStagger } = useGsapAnimations()

const showApple = ref(false)
const showHarmony = ref(false)
const appleBtn = ref<HTMLElement | null>(null)
const harmonyBtn = ref<HTMLElement | null>(null)

onMounted(() => {
  revealUp(root.value!.querySelector('.quote-cta__quote'), {})
  revealUp(root.value!.querySelector('.quote-cta__attr'), {})
  revealStagger(root.value!, '.quote-cta__btn')
  revealUp(root.value!.querySelector('.quote-cta__caption'), {})
})
</script>

<template>
  <section class="quote-cta" id="download" ref="root">
    <div class="container quote-cta__inner">
      <figure class="quote-cta__quote-block">
        <span class="quote-cta__quote-mark" aria-hidden="true">&ldquo;</span>
        <blockquote class="quote-cta__quote">{{ t.quote.text }}</blockquote>
        <figcaption class="quote-cta__attr">{{ t.quote.attribution }}</figcaption>
      </figure>

      <div class="quote-cta__actions">
        <div class="quote-cta__btn-row cta-row">
          <button
            ref="appleBtn"
            class="cta quote-cta__btn"
            type="button"
            data-qr-trigger
            @click="showApple = !showApple; showHarmony = false"
          >
            <svg viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
            </svg>
            <span>{{ t.finalCta.appStore }}</span>
          </button>
          <button
            ref="harmonyBtn"
            class="cta cta--ghost quote-cta__btn"
            type="button"
            data-qr-trigger
            @click="showHarmony = !showHarmony; showApple = false"
          >
            <img :src="harmonyIcon" alt="" class="cta-icon-img" />
            <span>{{ t.finalCta.harmony }}</span>
          </button>

          <QrPopover
            :open="showApple"
            :qr-src="qrApple"
            :title="t.finalCta.appStore"
            hint="使用 iPhone 相机扫描"
            align="start"
            :anchor="appleBtn"
            @close="showApple = false"
          />
          <QrPopover
            :open="showHarmony"
            :qr-src="qrHm"
            :title="t.finalCta.harmony"
            hint="使用 HarmonyOS 相机扫描"
            align="end"
            :anchor="harmonyBtn"
            @close="showHarmony = false"
          />
        </div>
        <p class="quote-cta__platform">
          <span>{{ t.finalCta.platformNote.ios }}</span>
          <span class="quote-cta__platform-dot" aria-hidden="true"></span>
          <span>{{ t.finalCta.platformNote.harmony }}</span>
        </p>
        <p class="quote-cta__caption">{{ t.finalCta.caption }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.quote-cta {
  padding: $sp-32 0;
  background: $color-bg;
  position: relative;

  @media (max-width: $bp-md) {
    padding: $sp-20 0;
  }

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $sp-16;
    align-items: center;
    border-top: 1px solid $color-line;
    padding-top: $sp-20;

    @media (max-width: $bp-md) {
      grid-template-columns: 1fr;
      gap: $sp-10;
      padding-top: $sp-12;
    }
  }

  &__quote-block {
    margin: 0;
    position: relative;
  }

  &__quote-mark {
    position: absolute;
    top: -24px;
    left: -8px;
    font-family: $font-serif;
    font-size: 72px;
    line-height: 1;
    color: $color-ink-muted;
    opacity: 0.35;
  }

  &__quote {
    font-family: $font-serif;
    font-size: clamp(22px, 2.4vw, 32px);
    line-height: 1.5;
    color: $color-ink;
    margin: 0 0 $sp-5;
    white-space: pre-line;
    font-style: normal;
    font-weight: $fw-medium;
    letter-spacing: -0.01em;
  }

  &__attr {
    font-family: $font-mono;
    font-size: $fs-xs;
    letter-spacing: $ls-wider;
    color: $color-ink-muted;
    text-transform: uppercase;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $sp-4;
    text-align: right;

    @media (max-width: $bp-md) {
      align-items: flex-start;
      text-align: left;
    }
  }

  &__btn-row {
    // 移动端布局统一由 .cta-row 全局类处理
    margin-top: 0;
  }

  &__platform {
    display: flex;
    align-items: center;
    gap: $sp-3;
    font-size: $fs-xs;
    color: $color-ink-muted;
    flex-wrap: wrap;

    &-dot {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: $color-ink-muted;
      opacity: 0.5;
    }
  }

  &__caption {
    font-family: $font-serif;
    font-style: italic;
    font-size: $fs-sm;
    color: $color-ink-soft;
    margin-top: $sp-2;
  }
}
</style>
