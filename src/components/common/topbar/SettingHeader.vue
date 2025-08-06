<script lang="ts" setup>
import '@/assets/styles/main.css'
import { defineProps, defineEmits } from 'vue'
import { ChevronLeft, Settings } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = withDefaults(
  defineProps<{
    title: string
    showLeftIcon?: boolean
    showRightIcon?: boolean
    walletId?: string
  }>(),
  {
    showLeftIcon: false,
    showRightIcon: false,
    walletId: '',
  },
)

const emits = defineEmits<{
  (e: 'left-click'): void
  (e: 'right-click'): void
}>()

const onLeftClick = () => emits('left-click')

// SettingHeader에서 설정 아이콘 클릭 시
const onRightClick = () => {
  emits('right-click')
  if (props.walletId) {
    router.push(`/card/setting/${props.walletId}`)
  } else {
    console.error('walletId가 전달되지 않았습니다.')
  }
}
</script>

<template>
  <div class="relative flex items-center justify-center px-3 h-[7.2rem] bg-white">
    <!-- 왼쪽 아이콘 -->
    <div
      v-if="showLeftIcon"
      class="absolute left-0 pl-3 flex items-center cursor-pointer"
      @click="onLeftClick"
      role="button"
      aria-label="뒤로가기"
    >
      <ChevronLeft :size="24" />
    </div>

    <!-- 제목 -->
    <div class="text-center Head0">{{ title }}</div>

    <!-- 오른쪽 아이콘 -->
    <div
      v-if="showRightIcon"
      class="absolute right-0 pr-3 flex items-center cursor-pointer"
      @click="onRightClick"
    >
      <Settings :size="24" class="text-Gray-5" role="button" aria-label="닫기" />
    </div>
  </div>
</template>
