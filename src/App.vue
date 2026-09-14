<script setup lang="ts">
import { onMounted } from 'vue'
import { useGsapAnimations, playHeroIntro } from './composables/useGsapAnimations'

import Navbar from './sections/Navbar.vue'
import Hero from './sections/Hero.vue'
import Features from './sections/Features.vue'
import Masterpiece from './sections/Masterpiece.vue'
import QuoteCta from './sections/QuoteCta.vue'
import Footer from './sections/Footer.vue'

useGsapAnimations() // 注册 ScrollTrigger + 提供 killAll onBeforeUnmount

onMounted(() => {
  document.body.classList.add('is-loaded')
  // 触发 hero intro
  playHeroIntro()
})
</script>

<template>
  <div class="app" id="top">
    <Navbar />
    <main class="app__main">
      <Hero />
      <Features />
      <Masterpiece />
      <QuoteCta />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss">
@use './styles/tokens' as *;

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
  }
}

// 路由滚动重置 / 锚点偏移
html {
  scroll-padding-top: #{$nav-height + 8};
}

// 选中文字颜色
::selection {
  background: rgba(26, 23, 20, 0.85);
  color: $color-bg;
}
</style>
