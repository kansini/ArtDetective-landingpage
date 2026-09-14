<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useLocaleStore } from '../composables/locale'
import Icon from '../icons/Icon.vue'

const locale = useLocaleStore()
const t = computed(() => locale.messages.nav)

const scrolled = ref(false)
function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled }">
    <div class="nav__inner container">
      <a class="nav__brand" href="#top" @click.prevent="scrollTo('top')">
        <span class="nav__brand-cn">探画</span>
        <span class="nav__brand-en">ART DETECTIVE</span>
      </a>

      <nav class="nav__menu" aria-label="Primary">
        <a
          v-for="(label, key) in t"
          :key="key"
          :href="`#${key}`"
          class="nav__link"
          :class="{ 'nav__link--active': key === 'home' }"
          @click.prevent="scrollTo(key)"
        >
          {{ label }}
        </a>
      </nav>

      <button class="nav__lang" :aria-label="`Switch to ${locale.code === 'zh' ? 'English' : '中文'}`" @click="locale.toggle()">
        <span :class="{ 'is-active': locale.code === 'zh' }">中</span>
        <span class="nav__lang-sep">/</span>
        <span :class="{ 'is-active': locale.code === 'en' }">EN</span>
      </button>

      <button class="nav__burger" aria-label="Menu">
        <Icon :size="22">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </Icon>
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: $nav-height;
  display: flex;
  align-items: center;
  transition: background 0.4s $ease-out, backdrop-filter 0.4s $ease-out, box-shadow 0.4s $ease-out;

  &--scrolled {
    background: rgba(245, 241, 234, 0.82);
    backdrop-filter: saturate(160%) blur(16px);
    -webkit-backdrop-filter: saturate(160%) blur(16px);
    box-shadow: 0 1px 0 rgba(26, 23, 20, 0.04);
  }

  &__inner {
    display: flex;
    align-items: center;
    width: 100%;
    gap: $sp-8;
  }

  &__brand {
    display: flex;
    flex-direction: column;
    line-height: 1;
    flex-shrink: 0;

    &-cn {
      font-family: $font-serif;
      font-size: 22px;
      font-weight: $fw-medium;
      letter-spacing: $ls-wide;
      color: $color-ink;
    }

    &-en {
      font-family: $font-mono;
      font-size: 9px;
      letter-spacing: $ls-widest;
      color: $color-ink-muted;
      margin-top: 4px;
    }
  }

  &__menu {
    display: flex;
    gap: $sp-10;
    margin: 0 auto 0 $sp-12;

    @media (max-width: $bp-md) {
      display: none;
    }
  }

  &__link {
    position: relative;
    font-size: $fs-sm;
    color: $color-ink-soft;
    padding: $sp-2 0;
    transition: color 0.3s $ease-out;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -2px;
      height: 1px;
      background: $color-ink;
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.3s $ease-out;
    }

    &:hover {
      color: $color-ink;
    }

    &--active {
      color: $color-ink;

      &::after {
        transform: scaleX(1);
      }
    }
  }

  &__lang {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: $font-mono;
    font-size: $fs-xs;
    letter-spacing: $ls-wide;
    color: $color-ink-muted;
    margin-left: auto;
    cursor: pointer;
    transition: color 0.3s $ease-out;

    &:hover {
      color: $color-ink;
    }

    .is-active {
      color: $color-ink;
      font-weight: $fw-medium;
    }

    &-sep {
      opacity: 0.4;
    }
  }

  &__burger {
    display: none;
    margin-left: $sp-3;

    @media (max-width: $bp-md) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      color: $color-ink;
    }
  }
}
</style>
