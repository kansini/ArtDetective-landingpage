<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useLocaleStore } from '../composables/locale'
import { useGsapAnimations } from '../composables/useGsapAnimations'
import heroImg from '../assets/water_Lilies.jpg'

const locale = useLocaleStore()
const t = computed(() => locale.messages.masterpiece)

const root = ref<HTMLElement | null>(null)
const bg = ref<HTMLElement | null>(null)
const { revealUp, parallaxY } = useGsapAnimations()

onMounted(() => {
  // 视差背景
  parallaxY(bg.value!, { speed: 60 })
  // 文字 reveal
  revealUp(root.value!.querySelector('.masterpiece__title'), {})
  revealUp(root.value!.querySelector('.masterpiece__eyebrow'), {})
  revealUp(root.value!.querySelector('.masterpiece__quote-block'), {})
})
</script>

<template>
  <section class="masterpiece" id="masterpiece" ref="root">
    <div class="masterpiece__bg" ref="bg">
      <img :src="heroImg" alt="" aria-hidden="true" />
      <div class="masterpiece__bg-overlay"></div>
    </div>

    <div class="container masterpiece__inner">
      <div class="masterpiece__copy">
        <h2 class="masterpiece__title">
          <span>{{ t.title1 }}</span>
          <span>{{ t.title2 }}</span>
        </h2>

        <p class="masterpiece__eyebrow">{{ t.eyebrow }}</p>
      </div>

      <figure class="masterpiece__quote-block">
        <span class="masterpiece__quote-mark" aria-hidden="true">&ldquo;</span>
        <blockquote class="masterpiece__quote">{{ t.quote }}</blockquote>
        <figcaption class="masterpiece__attr">{{ t.attribution }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.masterpiece {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: #F5F1EA;
  padding: $sp-32 0;

  @media (max-width: $bp-md) {
    min-height: auto;
    padding: $sp-24 0 $sp-20;
  }

  &__bg {
    position: absolute;
    inset: -8% 0;
    z-index: 0;
    will-change: transform;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  &__bg-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.15) 40%, rgba(0, 0, 0, 0.55) 100%);
  }

  &__inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $sp-16;
    align-items: end;

    @media (max-width: $bp-md) {
      grid-template-columns: 1fr;
      gap: $sp-10;
    }
  }

  &__copy {
    display: flex;
    flex-direction: column;
    gap: $sp-6;
  }

  &__title {
    font-family: $font-serif;
    font-size: clamp(30px, 4.6vw, 64px);
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: #FFFFFF;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-shadow: 0 2px 24px rgba(0, 0, 0, 0.25);
  }

  &__eyebrow {
    font-family: $font-mono;
    font-size: $fs-xs;
    line-height: 1.6;
    letter-spacing: $ls-widest;
    color: rgba(255, 255, 255, 0.85);
    text-transform: uppercase;
    white-space: pre-line;
    margin: 0;
  }

  &__quote-block {
    margin: 0;
    color: #FFFFFF;
    text-align: left;
    max-width: 360px;
    justify-self: end;

    @media (max-width: $bp-md) {
      justify-self: start;
      max-width: 100%;
    }
  }

  &__quote-mark {
    display: block;
    font-family: $font-serif;
    font-size: 56px;
    line-height: 0.5;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: $sp-2;
  }

  &__quote {
    font-family: $font-serif;
    font-size: clamp(18px, 1.5vw, 22px);
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.95);
    margin: 0 0 $sp-4;
    white-space: pre-line;
    font-style: normal;
  }

  &__attr {
    font-family: $font-mono;
    font-size: $fs-xs;
    letter-spacing: $ls-wider;
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
