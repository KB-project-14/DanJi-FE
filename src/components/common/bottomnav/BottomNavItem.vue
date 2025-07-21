<script setup lang="ts">
import { Wallet, Map, QrCode, Shield, UserRound } from 'lucide-vue-next'
import { computed, defineProps } from 'vue'

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
</script>

<template>
  <div class="bottomNaviItemWrapper" :class="{ active: isActive }">
    <slot :text="text">
      <div class="icon" :class="{ active: isActive }">
        <component :is="iconComponent" v-if="iconComponent" />
      </div>
      <div class="text Body04" :class="{ active: isActive }">{{ text }}</div>
    </slot>
  </div>
</template>

<style scoped>
.bottomNaviItemWrapper {
  display: flex;
  height: 7.3rem;
  width: 6rem;
  column-gap: 1.5rem;

  border-radius: 1.2rem;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.bottomNaviItemWrapper.active {
  background: rgba(255, 204, 0, 0.1); /* --Yellow00 투명도 10% */
}
.icon {
  color: var(--Gray05);
  transition: color 0.2s;
}
.icon.active {
  color: var(--Yellow00);
}
.text {
  color: var(--Gray05);
  margin-top: 0.6rem;
  transition: color 0.2s;
}
.text.active {
  color: var(--Yellow00);
}
</style>
