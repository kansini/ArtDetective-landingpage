<script setup lang="ts">
/**
 * QR 二维码气泡
 * - 点击外部 / Esc 关闭
 * - 箭头对齐到 trigger
 * - GSAP 淡入 + 缩放
 */
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{
  open: boolean
  qrSrc: string
  title: string
  hint?: string
  align?: 'start' | 'center' | 'end'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const panelRef = ref<HTMLElement | null>(null)

function close() {
  emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) close()
}

function onDocClick(e: MouseEvent) {
  if (!props.open) return
  const target = e.target as HTMLElement | null
  if (!target) return
  // 点击 trigger 或 popover 自身不算"外部"
  if (target.closest('[data-qr-trigger]')) return
  if (target.closest('[data-qr-popover]')) return
  close()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocClick)
})

watch(
  () => props.open,
  async (open) => {
    await nextTick()
    const el = panelRef.value
    if (!el) return
    if (open) {
      gsap.killTweensOf(el)
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: -8, scale: 0.94, transformOrigin: 'top center' },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: 'power3.out' },
      )
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        y: -6,
        scale: 0.96,
        duration: 0.18,
        ease: 'power2.in',
      })
    }
  },
)
</script>

<template>
  <Transition name="qr-fade">
    <div
      v-if="open"
      ref="panelRef"
      class="qr-popover"
      :class="`qr-popover--${align ?? 'center'}`"
      data-qr-popover
      role="dialog"
      aria-modal="false"
    >
      <span class="qr-popover__arrow" aria-hidden="true"></span>
      <div class="qr-popover__body">
        <div class="qr-popover__img-wrap">
          <img :src="qrSrc" :alt="title" class="qr-popover__img" />
        </div>

        <p class="qr-popover__title">{{ title }}</p>
        <p v-if="hint" class="qr-popover__hint">{{ hint }}</p>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.qr-popover {
  position: absolute;
  top: calc(100% + 14px);
  z-index: 90;
  background: $color-surface;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  box-shadow: 0 20px 60px rgba(26, 23, 20, 0.18), 0 6px 16px rgba(26, 23, 20, 0.06);
  padding: $sp-4;
  min-width: 200px;
  max-width: 240px;

  // alignment
  &--center {
    left: 50%;
    transform: translateX(-50%) translateY(0);
  }
  &--start {
    left: 0;
  }
  &--end {
    right: 0;
  }

  // 顶部小三角
  &__arrow {
    position: absolute;
    top: -6px;
    width: 12px;
    height: 12px;
    background: $color-surface;
    border-left: 1px solid $color-line;
    border-top: 1px solid $color-line;
    transform: rotate(45deg);

    .qr-popover--center & {
      left: 50%;
      margin-left: -6px;
    }
    .qr-popover--start & {
      left: 24px;
    }
    .qr-popover--end & {
      right: 24px;
    }
  }

  &__body {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $sp-2;
  }

  &__close {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: $color-ink-muted;
    background: $color-bg-alt;
    transition: color 0.2s $ease-out, background 0.2s $ease-out;
    z-index: 1;

    &:hover {
      color: $color-ink;
      background: $color-line;
    }
  }

  &__img-wrap {
    width: 168px;
    height: 168px;
    padding: 8px;
    background: #fff;
    border-radius: $radius-sm;
    border: 1px solid rgba(26, 23, 20, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  &__title {
    font-family: $font-serif;
    font-size: $fs-md;
    font-weight: $fw-medium;
    color: $color-ink;
    margin: $sp-1 0 0;
  }

  &__hint {
    font-size: $fs-xs;
    color: $color-ink-muted;
    line-height: 1.5;
    text-align: center;
    margin: 0;
  }
}

// Vue Transition (兜底, GSAP 才是主动画)
.qr-fade-enter-active,
.qr-fade-leave-active {
  transition: none; // 让 GSAP 控制
}
</style>
