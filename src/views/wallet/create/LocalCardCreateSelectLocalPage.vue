<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import DanjiSelect from '@/components/common/form/DanjiSelect.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'

import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import router from '@/router'

// 임시 타입
interface Region {
  id: number
  name: string
}

interface City {
  id: number
  name: string
}

interface LocalData {
  regions: Region[]
  cities: Record<string, City[]>
}

const localData = ref<LocalData>({ regions: [], cities: {} })
const selectedRegion = ref<string>('')
const selectedCity = ref<string>('')

const selectedRegionId = computed<number | null>(() => {
  return localData.value.regions?.find((region) => region.name === selectedRegion.value)?.id ?? null
})

const regionNames = computed<string[]>(() => {
  return localData.value.regions?.map((region) => region.name) ?? []
})

const cityNames = computed<string[]>(() => {
  const regionId = selectedRegionId.value
  if (!regionId) return []
  return localData.value.cities[regionId]?.map((city) => city.name) ?? []
})

const isButtonDisabled = computed(() => {
  return !selectedRegion.value || !selectedCity.value
})

const handleCardCreateConfirm = (): void => {
  router.push({
    name: 'LocalCardCreateDetail',
    params: {
      region: selectedRegion.value,
      city: selectedCity.value,
    },
  })
}

//mock api
const fetchLocalData = async (): Promise<void> => {
  try {
    const response = await axios.get('/api/local/list')
    localData.value = response.data.data
  } catch {}
}

onMounted(() => {
  fetchLocalData()
})
</script>

<template>
  <layout header-type="basic" header-title="지역화폐 카드 발급" showLeftIcon :is-bottom-nav="false">
    <template #content>
      <div class="mt-[2.5rem] mx-[2.9rem]">
        <div class="flex flex-col">
          <span class="Head03 text-Black-1">카드를 발급받을 지역을 선택해주세요.</span>
          <span class="Body03 text-Gray-5">선택한 지역의 가맹점에서 혜택을 받을 수 있습니다.</span>
        </div>

        <!-- 선택 -->
        <div class="mt-[2.5rem]">
          <span class="Body01 text-Brown-3">행정 구역(도) 선택:</span>
          <danji-select class="mt-[0.4rem]" :options="regionNames" v-model="selectedRegion" />
        </div>

        <div class="mt-[3.1rem]">
          <span class="Body01 text-Brown-3">지역 선택:</span>
          <danji-select class="mt-[0.4rem]" :options="cityNames" v-model="selectedCity" />
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex justify-center absolute bottom-[5rem] left-0 right-0">
        <danji-button variant="large" @click="handleCardCreateConfirm" :disabled="isButtonDisabled"
          >다음으로</danji-button
        >
      </div>
    </template>
  </layout>
</template>
