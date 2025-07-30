<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import LocalFilterModal from '@/components/common/modal/LocalFilterModal.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isModalVisible = ref<boolean>(false)
const selectedRegion = ref<string>('')
const selectedCity = ref<string>('')

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
  console.log(selectedCity, selectedRegion)
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

      <!-- 카드 이미지 임시 div -->
      <div
        class="mx-auto mt-[1.8rem] h-[19.8rem] w-[13.3rem] rounded-[0.8rem] border border-Gray-2 border-solid"
      />

      <!-- 카드 이름 -->
      <div class="text-center mt-[0.4rem]">
        <div class="text-Brown-4 Body01">부산 동백전</div>
      </div>

      <!-- 카드 혜택 정보 -->
      <div class="flex flex-col mt-[3rem] mx-[2.7rem]">
        <span class="Head03 text-Black-1"
          >지역경제 활성화로 <br />
          100(백)가지 행복과 즐거움을 주는 “동백전”</span
        >

        <span class="mt-[2rem] Head01 text-Black-1">Benefits</span>
        <span class="mt-[0.3rem] Head04 text-Brown-2">동백전 인센티브 10%</span>

        <div>
          <span class="Body02 text-Gray-5">최대 충전 가능 금액</span>
          <span class="ms-[0.5rem] Head04 text-Yellow-1">600,000원</span>
        </div>

        <span class="mt-[1.2rem] Body02 text-Black-1">
          연말정산 시, 현금과 같은 30% 소득공제가 됩니다! ~~~~ 어쩌구 ~~~ ㅓㅈ쩌구 연말정산 시,
          현금과 같은 30% 소득공제가 됩니다! ~~~~ 어쩌구 ~~~ ㅓㅈ쩌구
        </span>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex justify-center mt-[3.4rem] mb-[4rem]">
        <danji-button variant="large">발급하기</danji-button>
      </div>
    </template>
  </layout>
</template>
