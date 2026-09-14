<script setup lang="ts">
// 6 个功能的语义化占位图
// 用 SVG 几何 + 主题色画示意图, 等待真实截图后直接替换为 <img>

defineProps<{ index: number }>()
</script>

<template>
  <div class="illu" :data-idx="index">
    <!-- 1) 碎片拾光: 4 块拼成完整画作 -->
    <svg v-if="index === 0" viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="sw1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1F3A5F"/>
          <stop offset="1" stop-color="#3B5B89"/>
        </linearGradient>
        <linearGradient id="sw2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#E4A93E"/>
          <stop offset="1" stop-color="#F2C75C"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="320" fill="#0E1B2D"/>
      <!-- 月亮 -->
      <circle cx="160" cy="70" r="28" fill="url(#sw2)"/>
      <circle cx="155" cy="68" r="28" fill="#0E1B2D"/>
      <!-- 漩涡 -->
      <path d="M40 130 Q80 110 120 140 Q150 170 130 200 Q100 220 70 200 Q50 180 60 160" stroke="url(#sw1)" stroke-width="3" fill="none"/>
      <path d="M170 160 Q200 150 220 170 Q230 200 210 220 Q180 230 165 210" stroke="url(#sw1)" stroke-width="3" fill="none"/>
      <!-- 拼图分割线 -->
      <line x1="120" y1="0" x2="120" y2="320" stroke="#0A0A0A" stroke-width="3" stroke-dasharray="6 4"/>
      <line x1="0" y1="160" x2="240" y2="160" stroke="#0A0A0A" stroke-width="3" stroke-dasharray="6 4"/>
      <!-- 4 个角的"缺失"碎块 (强调 fragment 主题) -->
      <rect x="0" y="0" width="40" height="40" fill="#F5F1EA" opacity="0.15"/>
      <rect x="200" y="0" width="40" height="40" fill="#F5F1EA" opacity="0.15"/>
      <rect x="0" y="280" width="40" height="40" fill="#F5F1EA" opacity="0.15"/>
      <rect x="200" y="280" width="40" height="40" fill="#F5F1EA" opacity="0.15"/>
    </svg>

    <!-- 2) 暗夜寻光: 黑色背景 + 中心聚光灯 -->
    <svg v-else-if="index === 1" viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="spot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="#F2D9A8" stop-opacity="0.85"/>
          <stop offset="0.35" stop-color="#8A6A3E" stop-opacity="0.5"/>
          <stop offset="1" stop-color="#0A0A0A" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="240" height="320" fill="#0A0A0A"/>
      <!-- 聚光圈 -->
      <circle cx="120" cy="160" r="120" fill="url(#spot)"/>
      <!-- 隐约的人像轮廓 (戴珍珠耳环的少女 简化) -->
      <ellipse cx="120" cy="140" rx="36" ry="42" fill="#1F1A14" opacity="0.6"/>
      <ellipse cx="120" cy="220" rx="60" ry="50" fill="#1F1A14" opacity="0.5"/>
      <!-- 珍珠耳环高光 -->
      <circle cx="148" cy="155" r="4" fill="#F2D9A8"/>
    </svg>

    <!-- 3) 多种挑战: 三张选项卡 -->
    <svg v-else-if="index === 2" viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="240" height="320" fill="#F5F1EA"/>
      <!-- 顶部标题区 -->
      <rect x="0" y="0" width="240" height="50" fill="#1A1714"/>
      <text x="20" y="32" font-family="sans-serif" font-size="13" fill="#F5F1EA">这福画的作者是谁?</text>
      <!-- 主图 (莫奈日出) -->
      <rect x="20" y="68" width="200" height="100" rx="6" fill="#D8A659"/>
      <circle cx="170" cy="100" r="14" fill="#F2D9A8" opacity="0.8"/>
      <path d="M20 158 L80 130 L120 145 L180 125 L220 140" stroke="#3A2E1E" stroke-width="1.5" fill="none" opacity="0.6"/>
      <!-- 三个选项 -->
      <rect x="20" y="190" width="200" height="32" rx="6" fill="#1A1714"/>
      <text x="32" y="211" font-family="sans-serif" font-size="11" fill="#F5F1EA">A. 莫奈</text>
      <rect x="20" y="230" width="200" height="32" rx="6" fill="#2A2520" stroke="#D9D2C5" stroke-width="1" fill-opacity="0"/>
      <text x="32" y="251" font-family="sans-serif" font-size="11" fill="#1A1714">B. 德加</text>
      <rect x="20" y="270" width="200" height="32" rx="6" fill="#2A2520" stroke="#D9D2C5" stroke-width="1" fill-opacity="0"/>
      <text x="32" y="291" font-family="sans-serif" font-size="11" fill="#1A1714">C. 雷诺阿</text>
    </svg>

    <!-- 4) 作品故事: 名画 + 文字气泡 -->
    <svg v-else-if="index === 3" viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1F3A5F"/>
          <stop offset="1" stop-color="#3B5B89"/>
        </linearGradient>
      </defs>
      <rect width="240" height="320" fill="#0E1B2D"/>
      <!-- 星空 -->
      <circle cx="50" cy="50" r="2" fill="#F2D9A8"/>
      <circle cx="120" cy="35" r="1.5" fill="#F2D9A8"/>
      <circle cx="180" cy="60" r="2" fill="#F2D9A8"/>
      <circle cx="200" cy="100" r="1.5" fill="#F2D9A8"/>
      <!-- 月亮 -->
      <circle cx="60" cy="80" r="20" fill="#E4A93E"/>
      <!-- 漩涡 -->
      <path d="M0 180 Q40 160 80 180 Q120 200 100 240 Q60 260 30 240 Q10 220 20 200" stroke="url(#nightSky)" stroke-width="3" fill="#1F3A5F" opacity="0.6"/>
      <path d="M140 200 Q180 180 220 200 Q240 230 220 250 Q180 270 150 250 Q130 230 140 210" stroke="url(#nightSky)" stroke-width="3" fill="#1F3A5F" opacity="0.6"/>
      <!-- 暗影山 -->
      <path d="M0 260 L60 220 L120 250 L180 215 L240 250 L240 320 L0 320 Z" fill="#0A0F1A"/>
      <!-- 文字气泡 -->
      <rect x="20" y="270" width="200" height="38" rx="6" fill="#F5F1EA" opacity="0.95"/>
      <rect x="30" y="280" width="60" height="6" rx="2" fill="#1A1714"/>
      <rect x="30" y="292" width="120" height="4" rx="2" fill="#8A847C"/>
    </svg>

    <!-- 5) 我的画廊: 2x2 名画缩略图 -->
    <svg v-else-if="index === 4" viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="240" height="320" fill="#F5F1EA"/>
      <!-- 顶部 bar -->
      <rect x="0" y="0" width="240" height="36" fill="#FFFFFF"/>
      <text x="20" y="23" font-family="sans-serif" font-size="12" font-weight="600" fill="#1A1714">我的画廊 · 24</text>
      <!-- 2x2 缩略 -->
      <g>
        <rect x="16" y="52" width="100" height="120" rx="6" fill="#0E1B2D"/>
        <circle cx="60" cy="100" r="14" fill="#E4A93E" opacity="0.7"/>
      </g>
      <g>
        <rect x="124" y="52" width="100" height="120" rx="6" fill="#D8A659"/>
        <ellipse cx="160" cy="105" rx="22" ry="20" fill="#1A1714" opacity="0.5"/>
      </g>
      <g>
        <rect x="16" y="184" width="100" height="120" rx="6" fill="#2A4A7A"/>
        <path d="M30 250 Q60 220 90 250" stroke="#F2D9A8" stroke-width="2" fill="none"/>
      </g>
      <g>
        <rect x="124" y="184" width="100" height="120" rx="6" fill="#5A3E2A"/>
        <circle cx="174" cy="244" r="18" fill="#F2D9A8" opacity="0.4"/>
      </g>
    </svg>

    <!-- 6) 艺术勋章: 金色花型 -->
    <svg v-else-if="index === 5" viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="gold" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="#F2D9A8"/>
          <stop offset="0.7" stop-color="#B89968"/>
          <stop offset="1" stop-color="#7A6644"/>
        </radialGradient>
      </defs>
      <rect width="240" height="320" fill="#0F0E0C"/>
      <!-- 8 瓣花型勋章 -->
      <g transform="translate(120 160)">
        <g v-for="i in 8" :key="i" :transform="`rotate(${(i - 1) * 45})`">
          <ellipse cx="0" cy="-50" rx="22" ry="38" fill="url(#gold)" stroke="#5A4A2A" stroke-width="1"/>
        </g>
        <circle r="36" fill="url(#gold)" stroke="#5A4A2A" stroke-width="1.5"/>
        <circle r="22" fill="#0F0E0C" opacity="0.3"/>
        <text text-anchor="middle" y="6" font-family="serif" font-size="20" fill="#F5F1EA">名</text>
      </g>
      <!-- 文字 -->
      <text x="120" y="270" text-anchor="middle" font-family="serif" font-size="14" font-weight="600" fill="#F2D9A8">名画探索者</text>
      <text x="120" y="290" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#8A847C">完成 50 个挑战</text>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.illu {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: $radius-md;
  overflow: hidden;
  background: $color-bg-alt;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
