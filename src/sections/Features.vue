<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocaleStore } from '../composables/locale'

gsap.registerPlugin(ScrollTrigger)

const locale = useLocaleStore()
const t = computed(() => locale.messages.features)

const root = ref<HTMLElement | null>(null)
const triggers: ScrollTrigger[] = []
const hoverCleanups: Array<() => void> = []

// 6 个图标 (inline SVG)
const icons = [
  `<path d="M4 5h6v3a2 2 0 0 0 4 0V5h6v6h-3a2 2 0 0 0 0 4h3v4h-6v-3a2 2 0 0 0-4 0v3H4v-4h3a2 2 0 0 0 0-4H4V5z"/>`,
  `<path d="M12 2v3M5 5l2 2M2 12h3M5 19l2-2M19 19l-2-2M22 12h-3M19 5l-2 2"/><circle cx="12" cy="12" r="4"/>`,
  `<path d="M5 20V10M12 20V4M19 20v-7"/>`,
  `<path d="M3 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3V5zM21 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8V5z"/>`,
  `<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 14l4-4 4 4 3-3 5 5"/>`,
  `<circle cx="12" cy="9" r="5"/><path d="M9 13l-2 7 5-3 5 3-2-7"/>`,
]

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

onMounted(() => {
  if (!root.value) return

  // === 1) Header reveal ======================================
  const headerTrigger = ScrollTrigger.create({
    trigger: root.value.querySelector('.features__header') as Element,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo(
        root.value!.querySelector('.features__eyebrow') as Element,
        { autoAlpha: 0, x: -20 },
        { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out' },
      )
      gsap.fromTo(
        root.value!.querySelector('.features__title') as Element,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 },
      )
      gsap.fromTo(
        root.value!.querySelector('.features__subtitle') as Element,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 },
      )
    },
  })
  triggers.push(headerTrigger)

  // === 2) 卡片 3D 翻入 + Ken Burns 慢推 =======================
  const cards = gsap.utils.toArray<HTMLElement>('.feature-card')
  cards.forEach((card, i) => {
    const cardTrigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        // 卡片整体: opacity + y + scale 入场
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 60, scale: 0.94 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            delay: (i % 3) * 0.08,
            onComplete: () => gsap.set(card, { clearProps: 'transform' }),
          },
        )

        // 内部 stagger
        const inner = card.querySelectorAll(
          '.feature-card__index, .feature-card__icon, .feature-card__title, .feature-card__desc, .feature-card__more',
        )
        gsap.fromTo(
          inner,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.08,
            delay: 0.3 + (i % 3) * 0.08,
          },
        )

        // 序号数字递增
        const idxEl = card.querySelector('.feature-card__index-num')
        if (idxEl) {
          const state = { v: 0 }
          gsap.to(state, {
            v: i + 1,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.4 + (i % 3) * 0.08,
            onUpdate: () => {
              ;(idxEl as HTMLElement).textContent = pad(Math.round(state.v))
            },
          })
        }

        // 图片 Ken Burns: 1.15 → 1 (缓慢推近, 营造空间感)
        const img = card.querySelector('.feature-card__img') as HTMLElement | null
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.15, y: -10 },
            {
              scale: 1,
              y: 0,
              duration: 1.6,
              ease: 'power2.out',
              delay: 0.2 + (i % 3) * 0.08,
            },
          )
        }
      },
    })
    triggers.push(cardTrigger)

    // === 3) 图片视差 (scrub, 反向) ============================
    const visual = card.querySelector('.feature-card__visual')
    if (visual) {
      const visualTween = gsap.fromTo(
        visual,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      )
      if (visualTween.scrollTrigger) triggers.push(visualTween.scrollTrigger)
    }

    // === 4) 图片悬停放大 (mouseenter/leave) ===================
    const img = card.querySelector('.feature-card__img') as HTMLElement | null
    if (img) {
      const onEnter = () => {
        gsap.to(img, { scale: 1.06, duration: 0.6, ease: 'power2.out' })
      }
      const onLeave = () => {
        gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' })
      }
      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mouseleave', onLeave)
      hoverCleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter)
        card.removeEventListener('mouseleave', onLeave)
      })
    }
  })

  // === 5) 整段淡出 ===========================================
  const sectionTrigger = ScrollTrigger.create({
    trigger: root.value,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.6,
    animation: gsap.fromTo(
      root.value,
      { autoAlpha: 1 },
      { autoAlpha: 0.3, ease: 'none' },
    ),
  })
  triggers.push(sectionTrigger)
})

onBeforeUnmount(() => {
  triggers.forEach((t) => t.kill())
  triggers.length = 0
  hoverCleanups.forEach((fn) => fn())
  hoverCleanups.length = 0
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
            <span class="feature-card__index">
              <span class="feature-card__index-num">00</span>
            </span>
            <span class="feature-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" v-html="icons[i]" />
            </span>
            <h3 class="feature-card__title">{{ item.title }}</h3>
            <p class="feature-card__desc">{{ item.desc }}</p>
            <a class="feature-card__more" href="#">
              {{ t.more }}
              <span class="feature-card__arrow" aria-hidden="true">→</span>
            </a>
          </div>
          <div class="feature-card__visual">
            <img :src="`./features/${i}.png`" alt="" class="feature-card__img" />
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
  transform-style: preserve-3d;
  transition: transform 0.5s $ease-out, box-shadow 0.5s $ease-out, border-color 0.5s $ease-out;

  @media (max-width: $bp-md) {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  @media (max-width: $bp-sm) {
    min-height: 220px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;
    border-color: var(--color-ink-soft);
  }

  &__body {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: $sp-3;
    padding: $sp-6 $sp-5;

    @media (max-width: $bp-md) {
      padding: $sp-5 $sp-5 $sp-3;
      order: 2;
    }
    z-index: 1;
  }

  &__index {
    position: absolute;
    top: $sp-4;
    left: $sp-4;
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
    font-family: $font-mono;
    font-size: $fs-xs;
    letter-spacing: $ls-wide;
    color: $color-ink-muted;

    &-num {
      font-family: $font-serif;
      font-size: $fs-md;
      font-weight: $fw-medium;
      letter-spacing: 0;
      color: $color-ink;
      min-width: 1.5em;
      display: inline-block;
    }
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-top: $sp-4;
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

  // === visual 容器 (用户指定结构) =============================
  &__visual {
    position: relative;
    overflow: hidden;
    background: $color-bg-alt;
    will-change: transform;

    @media (max-width: $bp-md) {
      order: 1;
      aspect-ratio: 16 / 9;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    will-change: transform;
    transform-origin: center center;
  }
}
</style>
