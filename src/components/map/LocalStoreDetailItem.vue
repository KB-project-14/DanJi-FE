<script setup lang="ts">
import { computed } from 'vue'
import { Phone, ExternalLink, X } from 'lucide-vue-next'
import type { KakaoPlace } from '@/types/store/kakaoMapTypes'

interface Props {
  place: KakaoPlace | null
  isVisible: boolean
}

interface Emit {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const categoryInfo = computed(() => {
  if (!props.place?.category_name) return []

  return props.place.category_name
    .split(' > ')
    .map((category) => category.trim())
    .filter(Boolean)
})

const formattedPhone = computed(() => {
  if (!props.place?.phone) return null

  const phone = props.place.phone.replace(/-/g, '')
  if (phone.length === 10) {
    return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`
  } else if (phone.length === 11) {
    return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`
  }
  return props.place.phone
})

const openInKakaoMap = () => {
  if (props.place?.place_url) {
    window.open(props.place.place_url, '_blank')
  }
}

const makeCall = () => {
  if (props.place?.phone) {
    window.location.href = `tel:${props.place.phone}`
  }
}
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed bottom-0 left-0 right-0 max-h-[50vh] overflow-y-auto shadow-2xl"
  >
    <div v-if="place" class="relative w-full bg-White-0 shadow-2xl overflow-hidden" @click.stop>
      <div class="flex items-center justify-between p-[2rem]">
        <div class="flex-1">
          <span class="Head02 text-Black-1">{{ place.place_name }}</span>

          <div class="flex flex-wrap gap-[0.4rem] mb-[0.8rem] mt-[0.6rem]">
            <span
              v-for="category in categoryInfo"
              :key="category"
              class="px-[0.8rem] py-[0.2rem] bg-Gray-1 rounded-[0.4rem] Body04 text-Gray-6"
            >
              {{ category }}
            </span>
          </div>

          <div v-if="place.phone" class="flex items-center gap-[0.5rem]">
            <phone :size="12" class="text-Gray-5 flex-shrink-0" />
            <button @click="makeCall" class="Body03 text-Gray-5">
              {{ formattedPhone }}
            </button>
          </div>

          <div class="space-y-[0.6rem] mt-[0.6rem]">
            <div v-if="place.road_address_name" class="flex items-start gap-[0.6rem]">
              <span
                class="flex-shrink-0 px-[0.4rem] py-[0.2rem] Body05 text-Gray-6 border border-Gray-2 rounded-[0.4rem]"
                >도로명</span
              >
              <span class="flex-1 Body03 text-Gray-5 break-all">{{ place.road_address_name }}</span>
            </div>

            <div v-if="place.address_name" class="flex items-start gap-[0.6rem]">
              <span
                class="flex-shrink-0 px-[0.4rem] py-[0.2rem] Body05 text-Gray-6 border border-Gray-2 rounded-[0.4rem]"
                >지번</span
              >
              <span class="flex-1 Body03 text-Gray-5 break-all">{{ place.address_name }}</span>
            </div>
          </div>
        </div>
        <button @click="emit('close')" class="mb-auto" aria-label="닫기">
          <x :size="20" class="text-Gray-6" />
        </button>
      </div>

      <div class="p-[1.2rem] border-t border-Gray-1">
        <div class="flex">
          <button
            @click="openInKakaoMap"
            class="flex-1 flex items-center justify-center gap-[0.8rem] py-[1.4rem] bg-Brown-2 text-White-1 rounded-[1.2rem]"
          >
            <external-link :size="16" />
            <span class="Body02">카카오맵에서 상세보기</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="relative w-full bg-White-0 shadow-2xl overflow-hidden" @click.stop>
      <div class="flex items-center justify-between p-[2rem]">
        <div class="flex-1 text-center mt-[2rem]">
          <div class="py-[2rem]">
            <p class="Head03 text-Gray-6 mb-[0.8rem]">주소 정보가 없습니다</p>
            <p class="Body03 text-Gray-5 mb-[2rem]">선택한 위치의 상세 정보를 찾을 수 없습니다.</p>
          </div>
        </div>
        <button @click="emit('close')" class="mb-auto" aria-label="닫기">
          <x :size="20" class="text-Gray-6" />
        </button>
      </div>
    </div>
  </div>
</template>
