<script setup lang="ts">
import DanjiButton from '../button/DanjiButton.vue'
import fail from '@/assets/icons/fail.svg'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('close')
}
</script>

<template>
  <div
    v-if="props.isOpen"
    class="fixed inset-0 z-[1000] flex items-center justify-center"
    @keydown.esc="emit('close')"
    @click.self="emit('close')"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-label="카드 해지 안내"
  >
    <!-- 오버레이 -->
    <div class="absolute inset-0 bg-Black-1 bg-opacity-50 z-[1000]" />

    <!-- 모달 박스 -->
    <div
      class="z-[1001] flex flex-col items-center justify-center w-[33.8rem] h-[23.9rem] rounded-[1.6rem] bg-White-0"
    >
      <div class="flex flex-col items-center justify-center mb-[1.2rem]">
        <img
          class="w-[5.4rem] h-[5.4rem] mb-[1rem] mt-[3.1rem]"
          :src="fail"
          alt="통합지갑-결제-실패-아이콘"
        />
        <!-- 텍스트 -->
        <div class="flex flex-col items-center justify-center space-y-2 mb-[3.1rem]">
          <span class="Head03">해지하시겠습니까?</span>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="flex gap-3 w-full px-[3.1rem]">
        <div class="flex-1">
          <danji-button
            variant="smallOutline"
            class="w-full whitespace-nowrap text-center"
            @click="handleConfirm"
          >
            예
          </danji-button>
        </div>

        <div class="flex-1">
          <danji-button
            variant="small"
            class="w-full whitespace-nowrap text-center"
            @click="handleCancel"
          >
            아니요
          </danji-button>
        </div>
      </div>
    </div>
  </div>
</template>
