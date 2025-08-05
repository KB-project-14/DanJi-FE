<script setup lang="ts">
import mapMarker from '@/assets/icons/map-marker.svg'

interface Props {
  localCurrencyId: string
  storeName: string
  isSelected?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const COLORS = [
  '#FF3B30', // 강렬한 빨간색
  '#FF9500', // 쨍한 주황색
  '#FFD60A', // 밝은 노랑
  '#34C759', // 선명한 라임 그린
  '#00C7BE', // 강한 민트
  '#007AFF', // 맑은 블루
  '#5856D6', // 선명한 바이올렛
  '#AF52DE', // 밝은 자주색
  '#FF2D55', // 핫핑크
  '#5AC8FA', // 하늘색
  '#FF9F0A', // 진한 오렌지
  '#BF5AF2', // 핑크 보라
  '#FF375F', // 진한 레드핑크
  '#32D74B', // 밝은 초록
  '#0A84FF', // 밝고 강한 파랑
]

// 문자열을 해시값으로 변환 후 색상 반환
function getHashColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}
</script>

<template>
  <div @click.stop="emit('click')" class="relative flex flex-col items-center">
    <transition name="marker-scale" appear>
      <img
        v-if="isSelected"
        :src="mapMarker"
        alt="Selected Marker"
        class="absolute top-[-3rem] w-[40px] h-[40px] z-[10rem] pointer-events-none transform transition duration-300 ease-out scale-0 opacity-0 animate-fade-in-scale"
      />
    </transition>

    <div class="flex flex-col items-center">
      <svg
        width="25.8"
        height="25.8"
        viewBox="0 0 25.8 25.8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d)">
          <circle cx="12.9" cy="10.5" r="10.5" fill="white" />
          <circle cx="12.9" cy="10.5" r="9.1" :fill="getHashColor(props.localCurrencyId)" />
          <path
            d="M12.848 4.1447C12.9378 3.8683 13.3287 3.8683 13.4186 4.1447L14.6375 7.8962C14.6777 8.0198 14.7928 8.1035 14.9228 8.1035H18.8674C19.158 8.1035 19.279 8.4754 19.0436 8.6461L15.8525 10.9647C15.7473 11.0412 15.7046 11.1765 15.7448 11.3001L16.9637 15.0516C17.0536 15.328 16.7359 15.5578 16.5004 15.3871L13.3093 13.0685C13.2042 12.992 13.0621 12.992 12.957 13.0685L9.76591 15.3871C9.53042 15.5578 9.21274 15.328 9.30262 15.0516L10.5215 11.3001C10.5617 11.1765 10.519 11.0412 10.4138 10.9647L7.22271 8.6461C6.98722 8.4754 7.10826 8.1035 7.39887 8.1035H11.3435C11.4735 8.1035 11.5886 8.0198 11.6288 7.8962L12.848 4.1447Z"
            fill="white"
          />
        </g>
        <defs>
          <filter
            id="filter0_d"
            x="0"
            y="0"
            width="25.8"
            height="25.8"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="1.2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
        </defs>
      </svg>
    </div>
    <div class="Body03 text-center leading-tight w-[80px] truncate mt-[2px]">
      {{ storeName }}
    </div>
  </div>
</template>
