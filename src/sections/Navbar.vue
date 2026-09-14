<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useLocaleStore } from '../composables/locale'
import { useThemeStore } from '../composables/theme'

const locale = useLocaleStore()
const theme = useThemeStore()
const t = computed(() => locale.messages.nav)

const scrolled = ref(false)
const active = ref<'home' | 'features' | 'about'>('home')
const mobileOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let isClickScrolling = false
let clickScrollTimer: number | null = null

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
    void indicator.offsetWidth
    indicator.style.transition = prevTransition
  } else {
    indicator.style.width = `${width}px`
    indicator.style.transform = `translateX(${left}px)`
  }
}

function closeMobile() {
  mobileOpen.value = false
}

function setActiveAndScroll(id: string) {
  const key = id as 'home' | 'features' | 'about'
  active.value = key
  closeMobile()
  nextTick(() => updateIndicator())

  const el = document.getElementById(id)
  if (!el) return

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
  // 桌面 → 移动断点切换时关闭菜单
  if (window.innerWidth > 768 && mobileOpen.value) {
    closeMobile()
  }
  updateIndicator()
}

// 桌面菜单 DOM 变化时重算 (toggle mobileOpen 不影响桌面 indicator)
watch(mobileOpen, (open) => {
  if (!open) return
  // 打开时锁滚动
  document.body.style.overflow = 'hidden'
})
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && mobileOpen.value) closeMobile()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  document.addEventListener('keydown', onKeydown)
  onScroll()

  nextTick(() => nextTick(() => updateIndicator(true)))

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => updateIndicator(true))
  }

  if (menuRef.value) {
    resizeObserver = new ResizeObserver(() => updateIndicator())
    resizeObserver.observe(menuRef.value)
  }

  intersectionObserver = new IntersectionObserver(
    () => {
      if (isClickScrolling) return
      const scrollY = window.scrollY + window.innerHeight * 0.35
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
    { threshold: [0, 0.25, 0.5, 0.75, 1] },
  )

  for (const id of navOrder) {
    const el = document.getElementById(id)
    if (el) intersectionObserver.observe(el)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('keydown', onKeydown)
  if (clickScrollTimer) window.clearTimeout(clickScrollTimer)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled, 'nav--open': mobileOpen }">
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

      <div class="nav__right">
        <button
          class="theme-toggle"
          :aria-label="`Switch to ${theme.resolved === 'dark' ? 'light' : 'dark'} mode`"
          @click="theme.toggle()"
        >
          <!-- moon (light mode → show moon to switch to dark) -->
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <!-- sun (dark mode → show sun to switch to light) -->
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        </button>

        <button
          class="nav__lang"
          :aria-label="`Switch to ${locale.code === 'zh' ? 'English' : '中文'}`"
          @click="locale.toggle()"
        >
          <span :class="{ 'is-active': locale.code === 'zh' }">中</span>
          <span class="nav__lang-sep">/</span>
          <span :class="{ 'is-active': locale.code === 'en' }">EN</span>
        </button>

        <button
          class="nav__burger"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <span class="nav__burger-icon" :class="{ 'is-open': mobileOpen }" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </div>

    <!-- 移动菜单 (全屏抽屉) - Teleport 到 body 避免 backdrop-filter 影响 -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="mobileOpen" class="nav__drawer" @click.self="closeMobile">
          <nav class="nav__drawer-menu" aria-label="Mobile">
            <a
              v-for="(label, key) in t"
              :key="key"
              :href="`#${key}`"
              class="nav__drawer-link"
              :class="{ 'nav__drawer-link--active': active === key }"
              @click.prevent="setActiveAndScroll(key)"
            >
              <span class="nav__drawer-link-text">{{ label }}</span>
              <span class="nav__drawer-link-num">{{ String(navOrder.indexOf(key as any) + 1).padStart(2, '0') }}</span>
            </a>
          </nav>
        </div>
      </Transition>
    </Teleport>
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

  &--scrolled,
  &--open {
    background: var(--nav-glass-bg);
    backdrop-filter: saturate(160%) blur(16px);
    -webkit-backdrop-filter: saturate(160%) blur(16px);
  }

  &--scrolled {
    box-shadow: var(--nav-glass-shadow);
  }

  &__inner {
    display: flex;
    align-items: center;
    width: 100%;
    gap: $sp-8;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $sp-3;
    margin-left: auto;
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
    padding-bottom: 4px;

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
    min-height: 44px;
    display: inline-flex;
    align-items: center;

    &:hover {
      color: $color-ink;
    }

    &--active {
      color: $color-ink;
    }
  }

  &__indicator {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1px;
    width: 0;
    background: $color-ink;
    transform: translateX(0);
    transition: transform 0.45s $ease-out, width 0.45s $ease-out;
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
    cursor: pointer;
    transition: color 0.3s $ease-out;
    min-height: 44px;
    min-width: 44px;
    justify-content: center;
    padding: 0 4px;

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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    color: $color-ink;
    position: relative;

    @media (min-width: $bp-md + 1) {
      display: none;
    }
  }

  &__burger-icon {
    position: relative;
    width: 22px;
    height: 14px;
    display: block;

    span {
      position: absolute;
      left: 0;
      right: 0;
      height: 1.5px;
      background: currentColor;
      border-radius: 2px;
      transition: transform 0.35s $ease-out, top 0.35s $ease-out, opacity 0.2s $ease-out;

      &:nth-child(1) { top: 0; }
      &:nth-child(2) { top: 50%; transform: translateY(-50%); }
    }

    &.is-open span {
      &:nth-child(1) {
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
      }
      &:nth-child(2) {
        top: 50%;
        transform: translateY(-50%) rotate(-45deg);
      }
    }
  }

  // === 移动抽屉菜单 ==========================================
  &__drawer {
    position: fixed;
    top: $nav-height;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--nav-glass-bg);
    backdrop-filter: blur(16px);
    z-index: 99;
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }

  &__drawer-menu {
    display: flex;
    flex-direction: column;
    // 3 个 item 平分整个 drawer 高度
  }

  &__drawer-link {
    flex: 1;  // 平分 drawer 高度
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $sp-5 $sp-8;
    font-family: $font-serif;
    font-size: 32px;
    font-weight: $fw-medium;
    color: $color-ink-soft;
    border-bottom: 1px solid $color-line;
    transition: color 0.3s $ease-out, padding-left 0.3s $ease-out;

    &-text {
      line-height: 1;
    }

    &-num {
      font-family: $font-mono;
      font-size: $fs-xs;
      letter-spacing: $ls-wider;
      color: $color-ink-muted;
    }

    &--active {
      color: $color-ink;
      padding-left: $sp-10;
    }

    &:active {
      background: var(--color-bg-alt);
    }

    &:last-child {
      border-bottom: 0;
    }
  }
}

// 抽屉 transition
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s $ease-out, transform 0.35s $ease-out;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
