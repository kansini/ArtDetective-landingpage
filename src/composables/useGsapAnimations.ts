import { onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 注册一次
let registered = false
function ensureRegistered() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
}

/**
 * Apple 风格滚动动画合集
 * - revealUp: 元素从下方淡入 (整块内容)
 * - revealStagger: 子元素依次淡入 (列表)
 * - parallaxY: 视差滚动 (Y 方向)
 * - parallaxScale: 缩放视差
 * - pinnedReveal: pin 容器 + 内部元素分阶段揭示
 */
export function useGsapAnimations() {
  ensureRegistered()
  const triggers: ScrollTrigger[] = []

  function revealUp(target: gsap.DOMTarget, options: gsap.TweenVars & { scrollTrigger?: Record<string, unknown> } = {}) {
    const el = gsap.utils.toArray(target)[0] as gsap.TweenTarget | undefined
    if (!el) return
    const { scrollTrigger: stOpt, ...rest } = options
    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 60 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el as gsap.DOMTarget,
          start: 'top 85%',
          toggleActions: 'play none none none',
          ...(stOpt as object | undefined),
        },
        ...rest,
      },
    )
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    return tween
  }

  function revealStagger(
    container: gsap.DOMTarget,
    childSelector: string,
    options: gsap.TweenVars & { scrollTrigger?: Record<string, unknown> } = {},
  ) {
    const root = gsap.utils.toArray(container)[0] as gsap.DOMTarget | undefined
    if (!root) return
    const children = (root as Element).querySelectorAll(childSelector)
    if (!children.length) return
    const { scrollTrigger: stOpt, ...rest } = options
    const tween = gsap.fromTo(
      children,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play none none none',
          ...(stOpt as object | undefined),
        },
        ...rest,
      },
    )
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    return tween
  }

  function parallaxY(
    target: gsap.DOMTarget,
    options: { speed?: number; start?: string; end?: string } = {},
  ) {
    const el = gsap.utils.toArray(target)[0] as gsap.DOMTarget | undefined
    if (!el) return
    const speed = options.speed ?? -80
    const tween = gsap.fromTo(
      el,
      { y: -speed },
      {
        y: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: options.start ?? 'top bottom',
          end: options.end ?? 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      },
    )
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    return tween
  }

  function parallaxScale(
    target: gsap.DOMTarget,
    options: { from?: number; to?: number } = {},
  ) {
    const el = gsap.utils.toArray(target)[0] as gsap.DOMTarget | undefined
    if (!el) return
    const from = options.from ?? 1.1
    const to = options.to ?? 1.0
    const tween = gsap.fromTo(
      el,
      { scale: from },
      {
        scale: to,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      },
    )
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    return tween
  }

  /**
   * 数字递增 (适合 01/03 计数器 / 作品数等)
   */
  function countUp(
    target: gsap.DOMTarget,
    options: { from?: number; to?: number; duration?: number; format?: (v: number) => string } = {},
  ) {
    const el = gsap.utils.toArray(target)[0] as HTMLElement | undefined
    if (!el) return
    const from = options.from ?? 0
    const to = options.to ?? 100
    const duration = options.duration ?? 2
    const format = options.format ?? ((v) => Math.round(v).toString())
    const state = { v: from }
    const tween = gsap.to(state, {
      v: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = format(state.v)
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    return tween
  }

  function refresh() {
    ScrollTrigger.refresh()
  }

  function killAll() {
    triggers.forEach((t) => t.kill())
    triggers.length = 0
  }

  onBeforeUnmount(() => {
    killAll()
  })

  return {
    revealUp,
    revealStagger,
    parallaxY,
    parallaxScale,
    countUp,
    refresh,
    killAll,
  }
}

/**
 * Hero 区专用: 进入页面时立刻播放的加载动画
 */
export function playHeroIntro() {
  ensureRegistered()
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // 顶部 nav
  tl.fromTo(
    '.nav',
    { autoAlpha: 0, y: -20 },
    { autoAlpha: 1, y: 0, duration: 0.8 },
    0,
  )

  // 左侧文字
  tl.fromTo(
    '.hero__eyebrow',
    { autoAlpha: 0, y: 20 },
    { autoAlpha: 1, y: 0, duration: 0.8 },
    0.1,
  )
  tl.fromTo(
    '.hero__title-line',
    { autoAlpha: 0, y: 40 },
    { autoAlpha: 1, y: 0, duration: 1.0, stagger: 0.12 },
    0.2,
  )
  tl.fromTo(
    '.hero__subtitle',
    { autoAlpha: 0, y: 20 },
    { autoAlpha: 1, y: 0, duration: 0.8 },
    0.5,
  )
  tl.fromTo(
    '.hero__divider',
    { autoAlpha: 0, scaleX: 0 },
    { autoAlpha: 1, scaleX: 1, duration: 0.7, transformOrigin: 'left center' },
    0.6,
  )
  tl.fromTo(
    '.hero__cta',
    { autoAlpha: 0, y: 20 },
    { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 },
    0.7,
  )
  tl.fromTo(
    '.hero__platform',
    { autoAlpha: 0, y: 10 },
    { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 },
    0.85,
  )
  tl.fromTo(
    '.hero__corner-label',
    { autoAlpha: 0, y: 10 },
    { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 },
    0.95,
  )

  // 右侧手机
  tl.fromTo(
    '.hero__phone',
    { autoAlpha: 0, y: 80, scale: 0.92 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out' },
    0.4,
  )
  tl.fromTo(
    '.hero__side-label',
    { autoAlpha: 0, x: 20 },
    { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.1 },
    0.9,
  )
  tl.fromTo(
    '.hero__pager',
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.6 },
    1.1,
  )

  return tl
}
