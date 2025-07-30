<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import LocalFilterModal from '@/components/common/modal/LocalFilterModal.vue'
import CardInfo from '@/components/wallet/create/CardInfo.vue'
import CardBenefitInfo from '@/components/wallet/create/CardBenefitInfo.vue'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isModalVisible = ref<boolean>(false)
const selectedRegion = ref<string>('')
const selectedCity = ref<string>('')

// mock 데이터
const cardData = ref({
  name: '부산 동백전',
  image: '', // 현재는 빈 문자열로 임시 div 사용
  title: '지역경제 활성화로',
  subTitle: '100(백)가지 행복과 즐거움을 주는 "동백전"',
  incentiveText: '동백전 인센티브 10%',
  maxChargeAmount: '600,000원',
  description:
    '연말정산 시, 현금과 같은 30% 소득공제가 됩니다! ~~~~ 어쩌구 ~~~ ㅓㅈ쩌구 연말정산 시, 현금과 같은 30% 소득공제가 됩니다! ~~~~ 어쩌구 ~~~ ㅓㅈ쩌구',
})

const handleClickModal = (): void => {
  isModalVisible.value = !isModalVisible.value
}

const handleModalConfirm = (region: string, city: string): void => {
  selectedRegion.value = region
  selectedCity.value = city
  isModalVisible.value = false
}

// 라우터에서 전달받은 데이터 처리
const initializeFromRoute = () => {
  const routeRegion = route.params.region
  const routeCity = route.params.city

  if (routeRegion && typeof routeRegion === 'string') {
    selectedRegion.value = routeRegion
  }

  if (routeCity && typeof routeCity === 'string') {
    selectedCity.value = routeCity
  }
}

onMounted(async () => {
  initializeFromRoute()
})
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
        {{ selectedCity }}시
      </danji-chip>

      <!-- 지역 필터 모달 -->
      <local-filter-modal
        :is-visible="isModalVisible"
        v-model:initial-region="selectedRegion"
        v-model:initial-city="selectedCity"
        @close="handleClickModal"
        @confirm="handleModalConfirm"
      />

      <!-- 카드 이미지 & 이름 컴포넌트 -->
      <card-info :card-name="cardData.name" :card-image="cardData.image" />

      <!-- 카드 혜택 정보 컴포넌트 -->
      <card-benefit-info
        :title="cardData.title"
        :sub-title="cardData.subTitle"
        :incentive-text="cardData.incentiveText"
        :max-charge-amount="cardData.maxChargeAmount"
        :description="cardData.description"
      />

      <!-- 하단 버튼 -->
      <div class="flex justify-center mt-[3.4rem] mb-[4rem]">
        <danji-button variant="large">발급하기</danji-button>
      </div>
    </template>
  </layout>
</template>
