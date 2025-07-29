<script setup lang="ts">
import DanjiButton from '../button/DanjiButton.vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const handleConfirm = () => {
  emit('confirm')
  emit('cancel')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div
    v-if="props.isOpen"
    class="fixed inset-0 z-[1000] flex items-center justify-center"
    @keydown.esc="emit('cancel')"
    @click.self="emit('cancel')"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-label="결제"
  >
    <!-- 오버레이 -->
    <div class="absolute inset-0 bg-Black-1 bg-opacity-50 z-[1000]" />

    <!-- 모달 박스 -->
    <div
      class="z-[1001] flex flex-col items-center justify-center w-[33.8rem] h-[23.9rem] rounded-[1.6rem] bg-White-0"
    >
      <div class="flex flex-col items-center justify-center">
        <!-- 텍스트 -->
        <div class="flex flex-col items-center justify-center space-y-2">
          <span class="Head03">지역화폐로 결제하신 금액을 제외한</span>
          <span class="Head03"
            >금액은 <span class="text-Red-0">일반결제</span>로 자동 결제됩니다.</span
          >
        </div>
      </div>

      <!-- 버튼 -->
      <div class="relative top-[2.5rem] flex gap-3 w-full px-[3.1rem] mt-[2.7rem]">
        <div class="flex-1">
          <danji-button
            variant="small"
            class="w-full whitespace-nowrap text-center"
            @click="handleCancel"
          >
            취소
          </danji-button>
        </div>
        <div class="flex-1">
          <danji-button
            variant="smallOutline"
            class="w-full whitespace-nowrap text-center"
            @click="handleConfirm"
          >
            확인
          </danji-button>
        </div>
      </div>
    </div>
  </div>
</template>
