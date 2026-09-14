import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { zh, type Locale } from '../locales/zh'
import { en } from '../locales/en'

export type LocaleCode = 'zh' | 'en'

const STORAGE_KEY = 'art-detective-locale'

function getInitialLocale(): LocaleCode {
  // 1. URL hash override (方便分享和调试)
  const hash = window.location.hash.replace('#', '')
  if (hash === 'zh' || hash === 'en') return hash

  // 2. localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    // ignore
  }

  // 3. 浏览器语言
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('en')) return 'en'
  return 'zh'
}

export const useLocaleStore = defineStore('locale', () => {
  const code = ref<LocaleCode>(getInitialLocale())

  const messages = computed<Locale>(() => (code.value === 'zh' ? zh : en))

  function setLocale(next: LocaleCode) {
    code.value = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
    // 同步 hash (供分享/调试)
    if (window.location.hash !== `#${next}`) {
      history.replaceState(null, '', `#${next}`)
    }
    // 同步 html lang
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
  }

  function toggle() {
    setLocale(code.value === 'zh' ? 'en' : 'zh')
  }

  // 初始化 html lang
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code.value === 'zh' ? 'zh-CN' : 'en'
  }

  return { code, messages, setLocale, toggle }
})
