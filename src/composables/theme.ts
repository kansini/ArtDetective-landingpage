import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'art-detective-theme'

function getInitialMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved
  } catch {
    // ignore
  }
  return 'auto'
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'auto') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }
  return mode
}

function applyTheme(resolved: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', resolved)
  // 更新 meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', resolved === 'dark' ? '#0F0D0A' : '#F5F1EA')
  }
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(getInitialMode())
  const resolved = ref<'light' | 'dark'>(resolveTheme(mode.value))

  // 初始化
  applyTheme(resolved.value)

  // 监听 mode 变化
  watch(mode, (m) => {
    const r = resolveTheme(m)
    resolved.value = r
    applyTheme(r)
    try {
      localStorage.setItem(STORAGE_KEY, m)
    } catch {
      // ignore
    }
  })

  // auto 模式下跟随系统切换
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', () => {
      if (mode.value === 'auto') {
        const r = resolveTheme('auto')
        resolved.value = r
        applyTheme(r)
      }
    })
  }

  function setMode(next: ThemeMode) {
    mode.value = next
  }

  function toggle() {
    // light -> dark -> light (跳过 auto, auto 跟随系统)
    const r = resolved.value
    setMode(r === 'light' ? 'dark' : 'light')
  }

  return { mode, resolved, setMode, toggle }
})
