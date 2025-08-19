<script setup lang="ts">
import mapMarker from '@/assets/icons/map-marker.svg'
import type { ClusteredStore } from '@/types/store/storeTypes'
import { getHashColor } from '@/utils/getMarkerColors'
import { computed } from 'vue'

interface Props {
  cluster: ClusteredStore
  isSelected?: boolean
  mapLevel: number
}

interface Emit {
  (e: 'click'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const clusterColor = computed(() => {
  return getHashColor(props.cluster.stores[0].localCurrencyId)
})

const displayText = computed(() => {
  if (props.cluster.stores.length === 1) {
    return props.cluster.stores[0].name
  }
  return `${props.cluster.stores.length}`
})

const isSingleStore = computed(() => props.cluster.stores.length === 1)
</script>

<template>
  <div @click.stop="emit('click')" class="relative flex flex-col items-center cursor-pointer">
    <div v-if="mapLevel <= 13" class="flex flex-col items-center">
      <svg
        v-if="isSingleStore"
        width="25.8"
        height="25.8"
        viewBox="0 0 25.8 25.8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="transition-transform hover:scale-110"
        :class="{ 'scale-110': isSelected }"
      >
        <g filter="url(#filter0_d_single)">
          <circle cx="12.9" cy="10.5" r="10.5" fill="white" />
          <circle cx="12.9" cy="10.5" r="9.1" :fill="clusterColor" />
          <path
            d="M12.848 4.1447C12.9378 3.8683 13.3287 3.8683 13.4186 4.1447L14.6375 7.8962C14.6777 8.0198 14.7928 8.1035 14.9228 8.1035H18.8674C19.158 8.1035 19.279 8.4754 19.0436 8.6461L15.8525 10.9647C15.7473 11.0412 15.7046 11.1765 15.7448 11.3001L16.9637 15.0516C17.0536 15.328 16.7359 15.5578 16.5004 15.3871L13.3093 13.0685C13.2042 12.992 13.0621 12.992 12.957 13.0685L9.76591 15.3871C9.53042 15.5578 9.21274 15.328 9.30262 15.0516L10.5215 11.3001C10.5617 11.1765 10.519 11.0412 10.4138 10.9647L7.22271 8.6461C6.98722 8.4754 7.10826 8.1035 7.39887 8.1035H11.3435C11.4735 8.1035 11.5886 8.0198 11.6288 7.8962L12.848 4.1447Z"
            fill="white"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_single"
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

      <svg
        v-else
        width="35"
        height="35"
        viewBox="0 0 35 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="transition-transform hover:scale-110"
        :class="{ 'scale-110': isSelected }"
      >
        <g filter="url(#filter0_d_cluster)">
          <circle cx="17.5" cy="15" r="15" fill="white" />
          <circle cx="17.5" cy="15" r="12.5" :fill="clusterColor" />
          <text
            x="17.5"
            y="19"
            text-anchor="middle"
            fill="white"
            font-size="12"
            font-weight="600"
            font-family="system-ui, -apple-system, sans-serif"
          >
            {{ cluster.stores.length }}
          </text>
        </g>
        <defs>
          <filter
            id="filter0_d_cluster"
            x="0"
            y="0"
            width="35"
            height="35"
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
            <feOffset dy="3" />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
        </defs>
      </svg>
    </div>

    <div
      v-if="mapLevel <= 4"
      class="bg-White-1/50 Body03 text-center leading-tight truncate mt-[0.2rem]"
      :class="{ 'font-semibold': isSelected }"
    >
      <span v-if="isSingleStore">{{ displayText }}</span>
      <span v-else>{{ cluster.stores.length }}개 매장</span>
    </div>

    <transition
      enter-active-class="animate-fade-in-scale"
      leave-active-class="animate-fade-out-scale"
      appear
    >
      <img
        v-if="isSelected"
        :src="mapMarker"
        alt="Selected Marker"
        class="absolute top-[-3rem] w-[40px] h-[40px] z-[50] pointer-events-none"
      />
    </transition>
  </div>
</template>
