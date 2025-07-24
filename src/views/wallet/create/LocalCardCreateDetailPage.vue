<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import DanjiInput from '@/components/common/form/DanjiInput.vue'
import DanjiSelect from '@/components/common/form/DanjiSelect.vue'

// 타입 정의
interface Region {
  id: number
  name: string
}

interface City {
  id: number
  name: string
}

interface Card {
  id: number
  name: string
}

interface LocalData {
  data: {
    regions: Region[]
    cities: Record<number, City[]>
    cards: Record<number, Card[]>
  }
}

// 반응형 데이터
const selectedRegion = ref('')
const selectedCard = ref('')
const password = ref('')
const loading = ref(false)

// 데이터 저장소
const regions = ref<Region[]>([])
const cities = ref<City[]>([])
const cards = ref<Card[]>([])

// 컴포넌트에서 사용할 옵션 배열
const regionOptions = computed(() => regions.value.map((region) => region.name))
const cardOptions = computed(() => cards.value.map((card) => card.name))

// 현재 선택된 지역 정보
const currentRegion = computed(() =>
  regions.value.find((region) => region.name === selectedRegion.value),
)

// 현재 선택된 도시 정보
const currentCity = computed(() => {
  if (!currentRegion.value || cities.value.length === 0) return null
  return cities.value[0] // 첫 번째 도시를 기본값으로 사용
})

// Mock API에서 데이터 가져오기
const fetchLocalData = async () => {
  try {
    loading.value = true
    const response = await axios.get<LocalData>('/api/local/list')
    const data = response.data.data

    regions.value = data.regions

    // 기본값으로 첫 번째 지역 설정
    if (data.regions.length > 0) {
      selectedRegion.value = data.regions[0].name
    }
  } catch (error) {
    console.error('데이터를 불러오는데 실패했습니다:', error)
  } finally {
    loading.value = false
  }
}

// 지역 변경 시 도시와 카드 업데이트
watch(selectedRegion, async (newRegion) => {
  if (!newRegion) return

  try {
    const response = await axios.get<LocalData>('/api/local/list')
    const data = response.data.data

    const region = data.regions.find((r) => r.name === newRegion)
    if (region) {
      cities.value = data.cities[region.id] || []
      cards.value = data.cards[region.id] || []

      // 카드 선택 초기화
      selectedCard.value = ''

      // 기본값으로 첫 번째 카드 설정
      if (cards.value.length > 0) {
        selectedCard.value = cards.value[0].name
      }
    }
  } catch (error) {
    console.error('지역 데이터를 불러오는데 실패했습니다:', error)
  }
})

// 발급하기 버튼 클릭 핸들러
const handleSubmit = () => {
  if (!selectedRegion.value || !selectedCard.value || !password.value) {
    alert('모든 항목을 입력해주세요.')
    return
  }

  // 실제 발급 로직 구현
  console.log('발급 요청:', {
    region: selectedRegion.value,
    card: selectedCard.value,
    password: password.value,
  })

  alert('카드 발급이 신청되었습니다.')
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchLocalData()
})
</script>

<template>
  <Layout
    header-type="basic"
    header-title="지역화폐 카드 발급"
    :show-left-icon="true"
    :is-bottom-nav="false"
  >
    <template #content>
      <div class="h-full bg-Background overflow-hidden">
        <div
          class="px-[2.4rem] py-[3rem] mx-[1.6rem] space-y-[2.8rem] mt-[2rem] rounded-[1.6rem] bg-White-1 shadow-inner"
        >
          <!-- 지역 선택 -->
          <div>
            <DanjiSelect v-model="selectedRegion" label="지역 선택:" :options="regionOptions" />
          </div>

          <!-- 화폐 선택 -->
          <div>
            <DanjiSelect v-model="selectedCard" label="화폐 선택:" :options="cardOptions" />

            <!-- 혜택 정보 -->
            <div class="mt-[1.2rem] space-y-[0.4rem]">
              <p class="text-[1.2rem] text-Gray-6">강릉페이 인센티브 10%</p>
              <p class="text-[1.2rem] text-Orange-2 font-semibold">최대 충전 가능 금액 600,000원</p>
            </div>
          </div>

          <!-- 비밀번호 입력 -->
          <div>
            <label class="block mb-[0.4rem] text-Black-1 Head02"> 비밀번호 </label>
            <DanjiInput
              v-model="password"
              type="password"
              placeholder="6자리 비밀번호"
              text-align="left"
            />
          </div>
        </div>

        <!-- 발급하기 버튼 -->
        <div class="mt-[2.6rem] flex justify-center">
          <DanjiButton
            variant="large"
            :disabled="!selectedRegion || !selectedCard || !password"
            @click="handleSubmit"
          >
            발급하기
          </DanjiButton>
        </div>
      </div>
    </template>
  </Layout>
</template>
