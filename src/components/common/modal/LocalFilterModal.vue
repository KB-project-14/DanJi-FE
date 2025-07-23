<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import DanjiButton from '../button/DanjiButton.vue'
import DanjiChipGroup from '../chip/DanjiChipGroup.vue'

const props = defineProps<{
  isVisible: boolean
  initialCity: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', city: string): void
}>()

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
const selectedRegion = ref('경상북도')
const selectedCity = ref('포항시')

const selectedRegionId = computed(() => {
  return localData.value.regions?.find((region) => region.name === selectedRegion.value)?.id ?? null
})

const regionNames = computed(() => localData.value.regions?.map((region) => region.name))

const cityNames = computed(() => {
  const id = selectedRegionId.value
  if (id === null) return []
  return localData.value.cities[id.toString()]?.map((city) => city.name) || []
})

const fetchLocalData = async (): Promise<void> => {
  try {
    const response = await axios.get('/api/local/list')
    localData.value = response.data.data
    console.log(response.data)
  } catch {}
}

onMounted(() => {
  fetchLocalData()
})
</script>

<template>
  <div v-if="isVisible" class="flex fixed inset-0 bg-Black-1 bg-opacity-50" @click="emit('close')">
    <div
      class="flex flex-col w-full h-[45rem] px-[2.6rem] mt-auto pt-[2.8rem] pb-[0.8rem] bg-white rounded-t-[2rem] overflow-y-auto"
      @click.stop
    >
      <!-- 행정구역(도) 선택 -->
      <div class="mb-[4rem]">
        <h4 class="mb-[1rem] text-Black-2 Body00">행정구역(도)</h4>
        <danji-chip-group :options="regionNames" v-model="selectedRegion" />
      </div>

      <!-- 지역(시) 선택 -->
      <div class="mb-[4.4rem]">
        <h4 class="mb-[1rem] text-Black-2 Body00">지역(시)</h4>
        <danji-chip-group :options="cityNames" v-model="selectedCity" />
      </div>

      <!-- 확인 버튼 -->
      <div class="flex justify-center mt-auto mb-[0.8rem]">
        <danji-button variant="large" @click="emit('confirm', selectedCity)">확인</danji-button>
      </div>
    </div>
  </div>
</template>
