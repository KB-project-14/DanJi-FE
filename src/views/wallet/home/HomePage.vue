<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import TotalWallet from '@/components/wallet/TotalWallet.vue'
import HasCardSection from '@/components/wallet/HasCardSection.vue'
import NoCardSection from '@/components/wallet/NoCardSection.vue'

import useHomeCardList from '@/composables/home/useHomeCardList'
import { useWalletStore } from '@/stores/useWalletStore'
import { useMemberStore } from '@/stores/useMemberStore'
import { useLocation } from '@/composables/pay/useLocation'

const router = useRouter()
const walletStore = useWalletStore()
const memberStore = useMemberStore()

const { isLoading: isLocationLoading, error: locationError, fetchCurrentProvince } = useLocation()

const initializeLocation = async () => {
  try {
    const province = await fetchCurrentProvince()
  } catch (error) {}
}

const { sortedLocalWallets, localWalletCount } = useHomeCardList()

const cashBalance = computed(() => walletStore.cashWallet?.balance || 0)
const currentIndex = ref(0)

const goCardHistory = (id: string) => {
  router.push(`/card/history/${id}`)
}

const goCharge = () => {
  const selectedCard = sortedLocalWallets.value[currentIndex.value]
  if (selectedCard) router.push(`/card/charge/${selectedCard.walletId}`)
}

const goExchange = () => {
  const selectedCard = sortedLocalWallets.value[currentIndex.value]
  if (selectedCard) router.push(`/card/exchange/${selectedCard.walletId}`)
}

onMounted(() => {
  initializeLocation()
})
</script>

<template>
  <Layout :header-type="'main'" header-title="메인" :is-bottom-nav="true">
    <template #content>
      <div class="min-h-full bg-Background">
        <div class="flex justify-center pt-[3rem]">
          <div class="w-[270px]">
            <total-wallet :wallet-amount="cashBalance" />
          </div>
        </div>

        <div class="pl-20 pt-[4rem] pb-[3rem] px-[1rem]">
          <has-card-section
            v-if="localWalletCount > 0"
            :cards="sortedLocalWallets"
            @click-card="goCardHistory"
            @slide-change="currentIndex = $event"
          />
          <no-card-section v-else />
        </div>

        <div class="flex justify-center gap-10">
          <danji-button variant="small" @click="goCharge">충전</danji-button>
          <danji-button variant="small" @click="goExchange">환전</danji-button>
        </div>
      </div>
    </template>
  </Layout>
</template>
