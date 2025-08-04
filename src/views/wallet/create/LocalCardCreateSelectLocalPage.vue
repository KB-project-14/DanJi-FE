<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import DanjiSelect from '@/components/common/form/DanjiSelect.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import router from '@/router'
import useLocalSelector from '@/composables/local/useLocalSelector'

const {
  selectedRegion,
  selectedCity,
  shouldShowCitySelector,
  regionNames,
  cityNames,
  isButtonDisabled,
  selectedCityId,
  resetCity,
} = useLocalSelector()

// 지역 변경 시 시/구/군 초기화
const handleRegionChange = () => {
  resetCity()
}

const handleCardCreateConfirm = (): void => {
  router.push({
    name: 'LocalCardCreateDetail',
    params: {
      id: selectedCityId.value,
    },
  })
}
</script>

<template>
  <layout
    header-type="basic"
    header-title="지역화폐 카드 발급"
    :show-left-icon="true"
    :is-bottom-nav="false"
  >
    <template #content>
      <div class="mt-[2.5rem] mx-[2.9rem]">
        <div class="flex flex-col">
          <span class="Head03 text-Black-1">카드를 발급받을 지역을 선택해주세요.</span>
          <span class="Body03 text-Gray-5">선택한 지역의 가맹점에서 혜택을 받을 수 있습니다.</span>
        </div>

        <!-- 선택 -->
        <div class="mt-[2.5rem]">
          <span class="Body01 text-Brown-3">행정 구역(도) 선택:</span>
          <danji-select
            class="mt-[0.4rem]"
            :options="regionNames"
            v-model="selectedRegion"
            @update:modelValue="handleRegionChange"
          />
        </div>

        <div class="mt-[3.1rem]" v-if="shouldShowCitySelector">
          <span class="Body01 text-Brown-3">지역 선택:</span>
          <danji-select
            class="mt-[0.4rem]"
            :options="cityNames"
            v-model="selectedCity"
            :disabled="!selectedRegion"
          />
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex justify-center absolute bottom-[5rem] left-0 right-0">
        <danji-button variant="large" @click="handleCardCreateConfirm" :disabled="isButtonDisabled">
          다음으로
        </danji-button>
      </div>
    </template>
  </layout>
</template>
