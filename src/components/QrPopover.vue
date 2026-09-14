<script setup lang="ts">
/**
 * QR 二维码气泡
 * - Teleport to body: 脱离父容器 stacking context, 永远在最上层
 * - Fixed 定位 + 动态计算位置: 跟随 anchor 元素
 * - 滚动时自动关闭: 避免 popover 飞出视口
 * - Esc / 点击外部 / 滚动 / 关闭按钮 → emit('close')
 */
import { ref, watch, onMounted, onBeforeUnmount, nextTick, type PropType } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  open: { type: Boolean, default: false },
  qrSrc: { type: String, required: true },
  title: { type: String, required: true },
  hint: { type: String, default: '' },
  align: { type: String, default: 'center' }, // 'start' | 'center' | 'end'
  anchor: { type: Object as PropType<HTMLElement | null>, default: null },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const panelRef = ref<HTMLElement | null>(null)
const posStyle = ref<Record<string, string>>({ top: '0px', left: '0px', visibility: 'hidden' })

function updatePosition() {
  const anchor = props.anchor
  const panel = panelRef.value
  if (!anchor || !panel) return

  const rect = anchor.getBoundingClientRect()
  const panelRect = panel.getBoundingClientRect()
  const vw = window.innerWidth
  const margin = 8

  let left: number
  if (props.align === 'start') {
    left = rect.left
  } else if (props.align === 'end') {
    left = rect.right - panelRect.width
  } else {
    left = rect.left + rect.width / 2 - panelRect.width / 2
  }
  // 防止水平溢出
  if (left < margin) left = margin
  if (left + panelRect.width > vw - margin) left = vw - panelRect.width - margin

  const top = rect.bottom + 14
  posStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    visibility: 'visible',
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}
function onScrollOrResize() {
  if (props.open) emit('close')
}
function onDocClick(e: MouseEvent) {
  if (!props.open) return
  const target = e.target as HTMLElement | null
  if (!target) return
  if (target.closest('[data-qr-trigger]')) return
  if (target.closest('[data-qr-popover]')) return
  emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocClick)
  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('scroll', onScrollOrResize)
  window.removeEventListener('resize', onScrollOrResize)
})

watch(
  () => props.open,
  async (open) => {
    await nextTick()
    const el = panelRef.value
    if (!el) return
    if (open) {
      // 先定位到不可见避免闪烁
      posStyle.value = { ...posStyle.value, visibility: 'hidden' }
      // 等浏览器布局完 (锚点位置 + panel 自身尺寸)
      requestAnimationFrame(() => {
        updatePosition()
        // 字体可能异步加载, 再补一次
        requestAnimationFrame(() => {
          updatePosition()
          gsap.killTweensOf(el)
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: -8, scale: 0.94, transformOrigin: 'top center' },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: 'power3.out' },
          )
        })
      })
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
  <Teleport to="body">
    <div
      v-if="open"
      ref="panelRef"
      class="qr-popover"
      :class="`qr-popover--${align}`"
      :style="posStyle"
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
  </Teleport>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.qr-popover {
  position: fixed;
  z-index: 9999;
  background: $color-surface;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  box-shadow: 0 20px 60px rgba(26, 23, 20, 0.18), 0 6px 16px rgba(26, 23, 20, 0.06);
  padding: $sp-4;
  min-width: 200px;
  max-width: 240px;

  @media (max-width: $bp-sm) {
    left: 16px !important;
    right: 16px;
    width: auto;
    max-width: none;
    min-width: 0;
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

  &__img-wrap {
    width: 168px;
    height: 168px;
    padding: 8px;
    background: var(--color-surface);
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
</style>
