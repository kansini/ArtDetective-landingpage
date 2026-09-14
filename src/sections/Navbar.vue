<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useLocaleStore } from '../composables/locale'
import Icon from '../icons/Icon.vue'

const locale = useLocaleStore()
const t = computed(() => locale.messages.nav)

const scrolled = ref(false)
const active = ref<'home' | 'features' | 'about'>('home')
const menuRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let isClickScrolling = false
let clickScrollTimer: number | null = null

// 导航顺序 (与 section id 对应)
const navOrder: Array<'home' | 'features' | 'about'> = ['home', 'features', 'about']

function getLinks(): HTMLElement[] {
  const menu = menuRef.value
  if (!menu) return []
  return Array.from(menu.querySelectorAll<HTMLElement>('.nav__link'))
}

function updateIndicator(immediate = false) {
  const idx = navOrder.indexOf(active.value)
  const indicator = indicatorRef.value
  const links = getLinks()
  const link = links[idx]
  if (!link || !indicator) return

  const menu = menuRef.value
  if (!menu) return

  const linkRect = link.getBoundingClientRect()
  const menuRect = menu.getBoundingClientRect()
  const left = linkRect.left - menuRect.left
  const width = linkRect.width

  if (immediate) {
    const prevTransition = indicator.style.transition
    indicator.style.transition = 'none'
    indicator.style.width = `${width}px`
    indicator.style.transform = `translateX(${left}px)`
    // 强制 reflow
    void indicator.offsetWidth
    indicator.style.transition = prevTransition
  } else {
    indicator.style.width = `${width}px`
    indicator.style.transform = `translateX(${left}px)`
  }
}

function setActiveAndScroll(id: string) {
  const key = id as 'home' | 'features' | 'about'
  active.value = key
  // 立即更新 indicator
  nextTick(() => updateIndicator())

  const el = document.getElementById(id)
  if (!el) return

  // 标记点击滚动, 避免 IntersectionObserver 立即覆盖
  isClickScrolling = true
  if (clickScrollTimer) window.clearTimeout(clickScrollTimer)
  clickScrollTimer = window.setTimeout(() => {
    isClickScrolling = false
  }, 900)

  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll() {
  scrolled.value = window.scrollY > 24
}

function onResize() {
  updateIndicator()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  onScroll()

  // 初次定位 (等 DOM + 字体就绪)
  nextTick(() => {
    // 双 nextTick 确保 v-for 已经渲染
    nextTick(() => updateIndicator(true))
  })

  // 字体加载完成后重定位
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => updateIndicator(true))
  }

  // 监听 nav menu 容器尺寸变化
  if (menuRef.value) {
    resizeObserver = new ResizeObserver(() => updateIndicator())
    resizeObserver.observe(menuRef.value)
  }

  // 滚动联动: 检测当前 section
  intersectionObserver = new IntersectionObserver(
    () => {
      if (isClickScrolling) return
      // 用 scrollY 算当前 section
      const scrollY = window.scrollY + window.innerHeight * 0.35
      // 找出 scrollY 所在 section
      let currentId: 'home' | 'features' | 'about' = 'home'
      for (const id of navOrder) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const top = rect.top + window.scrollY
        if (scrollY >= top) {
          currentId = id
        }
      }
      if (active.value !== currentId) {
        active.value = currentId
        updateIndicator()
      }
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    },
  )

  // 观察所有 section
  for (const id of navOrder) {
    const el = document.getElementById(id)
    if (el) intersectionObserver.observe(el)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  if (clickScrollTimer) window.clearTimeout(clickScrollTimer)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
})
</script>

<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled }">
    <div class="nav__inner container">
      <a class="nav__brand" href="#top" @click.prevent="setActiveAndScroll('top')">
        <span class="nav__brand-cn">探画</span>
        <span class="nav__brand-en">ART DETECTIVE</span>
      </a>

      <nav ref="menuRef" class="nav__menu" aria-label="Primary">
        <a
          v-for="(label, key) in t"
          :key="key"
          :href="`#${key}`"
          class="nav__link"
          :class="{ 'nav__link--active': active === key }"
          @click.prevent="setActiveAndScroll(key)"
        >
          {{ label }}
        </a>
        <span ref="indicatorRef" class="nav__indicator" aria-hidden="true"></span>
      </nav>

      <button
        class="nav__lang"
        :aria-label="`Switch to ${locale.code === 'zh' ? 'English' : '中文'}`"
        @click="locale.toggle()"
      >
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
    position: relative;
    display: flex;
    align-items: center;
    gap: $sp-10;
    margin: 0 auto 0 $sp-12;
    padding-bottom: 4px; // 给 indicator 留出 baseline 下方空间

    @media (max-width: $bp-md) {
      display: none;
    }
  }

  &__link {
    position: relative;
    font-size: $fs-sm;
    color: $color-ink-soft;
    padding: $sp-2 0;
    line-height: 1;
    cursor: pointer;
    transition: color 0.3s $ease-out;

    &:hover {
      color: $color-ink;
    }

    &--active {
      color: $color-ink;
    }
  }

  // 单一 indicator 元素, 跟随 active 平滑滑动
  &__indicator {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1px;
    width: 0;
    background: $color-ink;
    transform: translateX(0);
    transition:
      transform 0.45s $ease-out,
      width 0.45s $ease-out;
    pointer-events: none;
    will-change: transform, width;
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
