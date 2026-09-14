<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useLocaleStore } from '../composables/locale'
import Icon from '../icons/Icon.vue'
import { useGsapAnimations } from '../composables/useGsapAnimations'

const locale = useLocaleStore()
const t = computed(() => {
  const m = locale.messages
  return { quote: m.quote, finalCta: m.finalCta }
})

const root = ref<HTMLElement | null>(null)
const { revealUp, revealStagger } = useGsapAnimations()

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
        <div class="quote-cta__btn-row">
          <a class="cta quote-cta__btn" href="#" @click.prevent>
            <Icon :size="18">
              <path d="M16.4 1.6c0 1.2-.5 2.4-1.4 3.2-.9.9-2 1.5-3.1 1.4-.1-1.2.4-2.4 1.3-3.2.9-.9 2.1-1.4 3.2-1.4zM20 17.3c-.6 1.3-.9 1.9-1.7 3.1-1.1 1.7-2.7 3.8-4.7 3.8-1.7 0-2.2-1.1-4.6-1.1-2.4 0-2.9 1.1-4.6 1.1-2 0-3.5-1.9-4.6-3.6C-.9 16.7-1.2 11.4.8 8.4c1.4-2.1 3.7-3.5 5.9-3.5 2.2 0 3.6 1.2 5.4 1.2 1.8 0 2.9-1.2 5.4-1.2 1.9 0 3.9 1 5.3 2.8-4.6 2.6-3.9 9.2-2.8 9.6z" />
            </Icon>
            <span>{{ t.finalCta.appStore }}</span>
          </a>
          <a class="cta cta--ghost quote-cta__btn" href="#" @click.prevent>
            <Icon :size="18">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </Icon>
            <span>{{ t.finalCta.harmony }}</span>
          </a>
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
    font-size: clamp(24px, 2.4vw, 32px);
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
    display: flex;
    gap: $sp-3;
    flex-wrap: wrap;
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
