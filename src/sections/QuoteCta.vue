<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useLocaleStore } from '../composables/locale'
import { useGsapAnimations } from '../composables/useGsapAnimations'
import QrPopover from '../components/QrPopover.vue'
import qrApple from '../assets/qr-apple.png'
import qrHm from '../assets/qr-hm.png'

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
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke-width="1.4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m15.5752 19.0792a4.2055 4.2055 0 0 0 -2.01 3.5376 4.0931 4.0931 0 0 0 2.4908 3.7542 9.7779 9.7779 0 0 1 -1.2755 2.6351c-.7941 1.1431-1.6244 2.2862-2.8878 2.2862s-1.5883-.734-3.0443-.734c-1.42 0-1.9252.7581-3.08.7581s-1.9611-1.0589-2.8876-2.3584a11.3987 11.3987 0 0 1 -1.9373-6.1487c0-3.61 2.3464-5.523 4.6566-5.523 1.2274 0 2.25.8062 3.02.8062.734 0 1.8771-.8543 3.2729-.8543a4.3778 4.3778 0 0 1 3.6822 1.841zm-6.8586-2.0456a1.3865 1.3865 0 0 1 -.2527-.024 1.6557 1.6557 0 0 1 -.0361-.337 4.0341 4.0341 0 0 1 1.0228-2.5148 4.1571 4.1571 0 0 1 2.7314-1.4078 1.7815 1.7815 0 0 1 .0361.373 4.1487 4.1487 0 0 1 -.9867 2.587 3.6039 3.6039 0 0 1 -2.5148 1.3236z" />
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="1.4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
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
