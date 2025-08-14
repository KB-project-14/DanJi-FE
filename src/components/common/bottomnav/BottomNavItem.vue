<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import { Wallet, Map, QrCode, Shield, UserRound } from 'lucide-vue-next'

const emit = defineEmits<{ (e: 'click'): void }>()

const props = defineProps<{
  text: string
  isActive: boolean
}>()

const iconComponent = computed(() => {
  switch (props.text) {
    case '지갑':
      return Wallet
    case '지도':
      return Map
    case 'QR':
      return QrCode
    case '뱃지':
      return Shield
    case '마이':
      return UserRound
    default:
      return Wallet
  }
})

function handleClick() {
  emit('click')
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-[7.3rem] w-[6rem] rounded-[1.2rem] cursor-pointer"
    :class="{ 'bg-Yellow-0/10': isActive }"
    @click="handleClick"
  >
    <div class="transition-colors duration-200" :class="isActive ? 'text-Yellow-0' : 'text-Gray-5'">
      <component :is="iconComponent" v-if="iconComponent" />
    </div>
    <div
      class="Body04 mt-[0.6rem] transition-colors duration-200"
      :class="isActive ? 'text-Yellow-0' : 'text-Gray-5'"
    >
      {{ props.text }}
    </div>
  </div>
</template>
