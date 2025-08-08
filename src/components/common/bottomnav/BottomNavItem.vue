<script setup lang="ts">
import { Wallet, Map, QrCode, Shield, UserRound } from 'lucide-vue-next'
import { computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const BottomNavProps = defineProps<{
  text: string
  isActive: boolean
}>()

const iconComponent = computed(() => {
  switch (BottomNavProps.text) {
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

const handleClick = () => {
  switch (BottomNavProps.text) {
    case '지갑':
      router.replace('/home')
      break
    case '지도':
      router.replace('/map')
      break
    case 'QR':
      router.replace('/qr')
      break
    case '뱃지':
      router.replace('/badge')
      break
    case '마이':
      router.replace('/mypage')
      break
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-[7.3rem] w-[6rem] rounded-[1.2rem] cursor-pointer"
    :class="{ 'bg-Yellow-0/10': isActive }"
    @click="handleClick"
  >
    <slot :text="text">
      <div
        class="transition-colors duration-200"
        :class="isActive ? 'text-Yellow-0' : 'text-Gray-5'"
      >
        <component :is="iconComponent" v-if="iconComponent" />
      </div>
      <div
        class="Body04 mt-[0.6rem] transition-colors duration-200"
        :class="isActive ? 'text-Yellow-0' : 'text-Gray-5'"
      >
        {{ text }}
      </div>
    </slot>
  </div>
</template>
