<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import DanjiInput from '@/components/common/form/DanjiInput.vue'
import DanjiSelect from '@/components/common/form/DanjiSelect.vue'
import { useRoute } from 'vue-router'

// 임시 타입
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

const selectedRegion = ref('')
const selectedCard = ref('')
const password = ref('')

const route = useRoute()

const regions = ref<Region[]>([])
const cities = ref<City[]>([])
const cards = ref<Card[]>([])

const regionOptions = computed(() => regions.value.map((region) => region.name))
const cardOptions = computed(() => cards.value.map((card) => card.name))

// 라우터에서 전달받은 데이터 처리
const initializeFromRoute = () => {
  const routeRegion = route.params.region

  if (routeRegion && typeof routeRegion === 'string') {
    selectedRegion.value = routeRegion
  }
}

// Mock API
const fetchLocalData = async () => {
  try {
    const response = await axios.get<LocalData>('/api/local/list')
    const data = response.data.data
    regions.value = data.regions
  } catch (error) {
    console.error('데이터를 불러오는데 실패했습니다:', error)
  }
}

// 지역 변경 후 화폐 카테고리 업데이트
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

const handleSubmit = () => {
  alert('카드 발급이 신청되었습니다.')
}

onMounted(async () => {
  initializeFromRoute()
  await fetchLocalData()
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
            <danji-select v-model="selectedRegion" label="지역 선택:" :options="regionOptions" />
          </div>

          <!-- 화폐 선택 -->
          <div>
            <danji-select v-model="selectedCard" label="화폐 선택:" :options="cardOptions" />

            <!-- 혜택 정보 -->
            <div class="ms-[0.6rem] mt-[0.2rem] space-y-[0.4rem]">
              <p class="text-Brown-2 Head04">강릉페이 인센티브 10%</p>
              <p>
                <span class="text-Gray-5 Body02">최대 충전 가능 금액</span>
                <span class="ms-[0.6rem] text-Yellow-1 Head04">600,000원</span>
              </p>
            </div>
          </div>

          <!-- 비밀번호 입력 -->
          <div>
            <label class="block mb-[0.4rem] text-Black-1 Head02"> 비밀번호 </label>
            <danji-input
              v-model="password"
              type="password"
              placeholder="지갑 비밀번호"
              text-align="left"
            />
          </div>
        </div>

        <!-- 발급하기 버튼 -->
        <div class="mt-[2.6rem] flex justify-center">
          <danji-button
            variant="large"
            :disabled="!selectedRegion || !selectedCard || !password"
            @click="handleSubmit"
          >
            발급하기
          </danji-button>
        </div>
      </div>
    </template>
  </Layout>
</template>
