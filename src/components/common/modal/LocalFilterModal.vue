<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import DanjiButton from '../button/DanjiButton.vue'
import DanjiChipGroup from '../chip/DanjiChipGroup.vue'

const props = defineProps<{
  isVisible: boolean
  initalRegion: string
  initialCity: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', region: string, city: string): void
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
const selectedRegion = ref<string>(props.initalRegion)
const selectedCity = ref<string>(props.initialCity)

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

function getFirstCityOfRegion(regionName: string) {
  const region = localData.value.regions?.find((r) => r.name === regionName)
  if (!region) return ''

  const cities = localData.value.cities[region.id]
  return cities?.[0]?.name ?? ''
}

watch(
  selectedRegion,
  (newRegion) => {
    const firstCity = getFirstCityOfRegion(newRegion)
    selectedCity.value = firstCity
  },
  { immediate: false },
)

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
  <div
    class="fixed inset-0 bg-Black-1 z-50 flex transition-all duration-300"
    :class="isVisible ? 'bg-opacity-50 pointer-events-auto' : 'bg-opacity-0 pointer-events-none'"
    @click="emit('close')"
  >
    <div
      class="flex flex-col w-full h-[45rem] px-[2.6rem] mt-auto pt-[2.8rem] pb-[0.8rem] bg-white rounded-t-[2rem] overflow-y-auto transition-transform duration-300 ease-out"
      :class="isVisible ? 'translate-y-0' : 'translate-y-full'"
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
        <danji-button variant="large" @click="emit('confirm', selectedRegion, selectedCity)"
          >확인</danji-button
        >
      </div>
    </div>
  </div>
</template>
