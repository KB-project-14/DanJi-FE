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
import type { localCardCreateRequestDtoType } from '@/types/local/localTypes'

const route = useRoute()
const routeCityId = computed(() => Number(route.params.id))

const isModalVisible = ref<boolean>(false)

const { selectedRegion, selectedCity, selectedCityId, getLocalInfoById } = useLocalSelector()
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
  selectedRegion.value = region
  selectedCity.value = city
  isModalVisible.value = false

  await nextTick()

  if (selectedCityId.value) {
    router.replace({
      name: 'LocalCardCreateDetail',
      params: { id: selectedCityId.value.toString() },
    })
  }
}

const { mutate, isPending } = useAddLocalCard()

const handleCompeleteClick = () => {
  const requestBody: localCardCreateRequestDtoType = {
    localCurrencyId: localCurrencyId.value,
    walletType: 'LOCAL',
  }

  mutate(requestBody)
}
</script>

<template>
  <layout header-type="basic" header-title="지역화폐 카드 발급" showLeftIcon :is-bottom-nav="false">
    <template #content>
      <!-- 상단 구분선 -->
      <div class="w-full h-[0.1rem] bg-Gray-0" />

      <!-- 지역 선택 칩 -->
      <danji-chip
        class="ms-[2.7rem] mt-[1.2rem]"
        :is-active="true"
        :is-icon="true"
        @click="handleClickModal"
      >
        {{ localInfo.value?.city ?? localInfo.value?.province }}
      </danji-chip>

      <!-- 지역 필터 모달 -->
      <local-filter-modal
        :is-visible="isModalVisible"
        v-bind:initial-region="selectedRegion"
        v-bind:initial-city="selectedCity"
        @close="handleClickModal"
        @confirm="handleModalConfirm"
      />

      <!-- 카드 이미지 & 이름 컴포넌트 -->
      <card-info :card-name="localCurrencyName" />

      <!-- 카드 혜택 정보 컴포넌트 -->
      <card-benefit-info
        :incentive-text="benefitDescription"
        :max-charge-amount="String(benefitInfo?.maximum ?? 0)"
      />

      <!-- 하단 버튼 -->
      <div class="flex justify-center mt-[3.4rem] mb-[4rem]">
        <danji-button variant="large" @click="handleCompeleteClick" :disabled="isPending"
          >발급하기</danji-button
        >
      </div>
    </template>
  </layout>
</template>
