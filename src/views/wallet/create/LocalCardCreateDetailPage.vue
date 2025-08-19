<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import LocalFilterModal from '@/components/common/modal/LocalFilterModal.vue'
import CardInfo from '@/components/wallet/create/CardInfo.vue'
import CardBenefitInfo from '@/components/wallet/create/CardBenefitInfo.vue'
import { ref, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import useLocalCurrencyInfo from '@/composables/local/useLocalCurrencyInfo'
import useLocalSelector from '@/composables/local/useLocalSelector'
import router from '@/router'
import useAddLocalCard from '@/composables/queries/local/useAddLocalCard'
import type { LocalCardCreateRequestDTO } from '@/types/local/localTypes'

const route = useRoute()
const routeCityId = computed(() => Number(route.params.id))

const isModalVisible = ref<boolean>(false)

const { selectedRegion, selectedCity, selectedCityId, getLocalInfoById, setLocal } =
  useLocalSelector()
const { localCurrencyName, benefitInfo, benefitDescription, localCurrencyId } =
  useLocalCurrencyInfo(
    computed(() => ({
      province: null,
      city: null,
      benefitType: null,
      localCurrencyId: null,
      regionId: routeCityId.value,
    })),
  )

const localInfo = computed(() => getLocalInfoById(routeCityId.value))

const handleClickModal = (): void => {
  isModalVisible.value = !isModalVisible.value
}

const handleModalConfirm = async (region: string, city: string): Promise<void> => {
  setLocal(region, city)
  isModalVisible.value = false

  await nextTick()

  if (selectedCityId.value) {
    router.replace({
      name: 'LocalCardCreateDetail',
      params: { id: selectedCityId.value.toString() },
    })
  }
}

const { mutate, isPending, isError } = useAddLocalCard()

const handleCompeleteClick = () => {
  const requestBody: LocalCardCreateRequestDTO = {
    localCurrencyId: localCurrencyId.value,
    walletType: 'LOCAL',
  }

  mutate(requestBody, {
    onSuccess: () => {
      router.replace({ name: 'LocalCardCreateSuccess' })
    },
    onError(error) {},
  })
}
</script>

<template>
  <layout header-type="basic" header-title="지역화폐 카드 발급" showLeftIcon :is-bottom-nav="false">
    <template #content>
      <div class="bg-White-1">
        <div class="w-full h-[0.1rem] bg-Gray-0" />

        <danji-chip
          class="ms-[2.7rem] mt-[1.2rem]"
          :is-active="true"
          :is-icon="true"
          @click="handleClickModal"
        >
          {{ localInfo.value?.city ?? localInfo.value?.province }}
        </danji-chip>

        <local-filter-modal
          :is-visible="isModalVisible"
          v-bind:initial-region="selectedRegion"
          v-bind:initial-city="selectedCity"
          @confirm="handleModalConfirm"
        />

        <card-info
          :card-name="localCurrencyName"
          :card-image="benefitInfo?.img ? `http://danji.cloud${benefitInfo.img}` : undefined"
        />

        <card-benefit-info
          :incentive-text="benefitDescription"
          :max-charge-amount="benefitInfo?.maximum ?? 0"
        />

        <div class="flex justify-center mt-[3.4rem] mb-[4rem]">
          <danji-button variant="large" @click="handleCompeleteClick" :disabled="isPending">
            {{ isPending ? '발급하는 중…' : '발급하기' }}</danji-button
          >
        </div>
      </div>
    </template>
  </layout>
</template>
