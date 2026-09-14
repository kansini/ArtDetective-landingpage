<script setup lang="ts">
import { computed } from 'vue'
import { useLocaleStore } from '../composables/locale'
import Icon from '../icons/Icon.vue'

const locale = useLocaleStore()
const t = computed(() => locale.messages.footer)
</script>

<template>
  <footer class="footer" id="about">
    <div class="container footer__inner">
      <div class="footer__brand">
        <span class="footer__brand-cn">探画</span>
        <span class="footer__brand-en">ART DETECTIVE</span>
      </div>

      <nav class="footer__links" aria-label="Footer">
        <a v-for="(label, key) in t.links" :key="key" href="#" @click.prevent>
          {{ label }}
        </a>
      </nav>

      <div class="footer__social" aria-label="Social media">
        <a class="footer__icon" href="#" @click.prevent aria-label="X (Twitter)">
          <Icon :size="16">
            <path d="M4 4l7.5 9.5L4.5 20H7l5.5-6 4.5 6H21l-7.7-10L20.5 4H18l-5 5.5L9 4H4z" />
          </Icon>
        </a>
        <a class="footer__icon" href="#" @click.prevent aria-label="Instagram">
          <Icon :size="16">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
          </Icon>
        </a>
      </div>

      <p class="footer__copy">{{ t.copyright }}</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.footer {
  border-top: 1px solid $color-line;
  background: $color-bg;
  padding: $sp-10 0;

  &__inner {
    display: flex;
    align-items: center;
    gap: $sp-8;
    flex-wrap: wrap;

    @media (max-width: $bp-md) {
      gap: $sp-4 $sp-6;
    }
  }

  &__brand {
    display: flex;
    flex-direction: column;
    line-height: 1;
    margin-right: auto;

    &-cn {
      font-family: $font-serif;
      font-size: 18px;
      font-weight: $fw-medium;
      letter-spacing: $ls-wide;
      color: $color-ink;
    }

    &-en {
      font-family: $font-mono;
      font-size: 8px;
      letter-spacing: $ls-widest;
      color: $color-ink-muted;
      margin-top: 3px;
    }
  }

  &__links {
    display: flex;
    gap: $sp-6;
    margin: 0 auto 0 0;

    @media (max-width: $bp-md) {
      margin: 0;
      flex: 1 1 100%;
      order: 5;
      gap: $sp-5;
    }

    a {
      font-size: $fs-xs;
      color: $color-ink-soft;
      letter-spacing: $ls-wide;
      transition: color 0.3s $ease-out;

      &:hover {
        color: $color-ink;
      }
    }
  }

  &__social {
    display: flex;
    gap: $sp-3;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: $color-ink-soft;
    transition: color 0.3s $ease-out, background 0.3s $ease-out;

    &:hover {
      color: $color-ink;
      background: $color-bg-alt;
    }
  }

  &__copy {
    font-family: $font-mono;
    font-size: 11px;
    letter-spacing: $ls-wide;
    color: $color-ink-muted;
    margin: 0 0 0 $sp-4;
    white-space: nowrap;

    @media (max-width: $bp-md) {
      margin: 0;
      flex: 1 1 100%;
      order: 6;
    }
  }
}
</style>
