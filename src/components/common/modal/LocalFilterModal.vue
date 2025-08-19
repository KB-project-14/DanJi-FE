<script setup lang="ts">
import { watch } from 'vue'
import DanjiButton from '../button/DanjiButton.vue'
import DanjiChipGroup from '../chip/DanjiChipGroup.vue'
import useLocalSelector from '@/composables/local/useLocalSelector'

/**
 * LocalFilterModal - 지역(도/시) 선택 모달 컴포넌트
 *
 * 도/시 단위의 지역을 선택할 수 있는 하단 슬라이드형 모달입니다.
 * 외부에서 `isVisible`로 모달 표시 여부를 제어하고, 선택된 지역 정보를 `confirm` 이벤트로 전달합니다.
 *
 * `DanjiChipGroup`을 활용해 도/시를 각각 탭 형태로 선택할 수 있으며,
 * 모달 외부를 클릭하면 `close` 이벤트가 발생하여 닫히도록 설계되어 있습니다.
 *
 * @component
 *
 * @example 기본 사용법
 * ```vue
 * <region-select-modal
 *   :is-visible="isModalOpen"
 *   :inital-region="'강원도'"
 *   :initial-city="'춘천시'"
 *   @close="isModalOpen = false"
 *   @confirm="handleRegionConfirm"
 * />
 * ```
 *
 * @example 이벤트 핸들링
 * ```ts
 * const handleRegionConfirm = (region: string, city: string) => {
 *   console.log('선택된 지역:', region, city)
 * }
 * ```
 *
 * @prop isVisible - 모달 표시 여부 (`true`이면 나타나고, `false`이면 숨겨집니다)
 * @prop initalRegion - 초기 선택 도 이름 (예: `'강원도'`)
 * @prop initialCity - 초기 선택 시 이름 (예: `'춘천시'`)
 *
 * @event confirm - "확인" 버튼 클릭 시 발생하며, 선택된 도/시 정보를 함께 전달합니다.
 *                  `(region: string, city: string)` 형식으로 전달됩니다.
 *
 */

const props = defineProps<{
  isVisible: boolean
  initialRegion: string
  initialCity: string
}>()

const emit = defineEmits<{
  (e: 'confirm', region: string, city: string): void
}>()

const {
  selectedRegion,
  selectedCity,
  shouldShowCitySelector,
  regionNames,
  cityNames,
  isButtonDisabled,
  resetCity,
} = useLocalSelector()

const handleRegionChange = () => {
  resetCity()
}

watch(
  () => props.isVisible,
  (visible) => {
    if (visible) {
      selectedRegion.value = props.initialRegion
      selectedCity.value = props.initialCity
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="fixed inset-0 bg-Black-1 z-50 flex transition-all duration-300"
    :class="isVisible ? 'bg-opacity-50 pointer-events-auto' : 'bg-opacity-0 pointer-events-none'"
  >
    <div
      class="flex flex-col w-full h-[45rem] px-[2.6rem] mt-auto pt-[2.8rem] pb-[0.8rem] bg-white rounded-t-[2rem] overflow-y-auto transition-transform duration-300 ease-out"
      :class="isVisible ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="mb-[4rem]">
        <h4 class="mb-[1rem] text-Black-2 Body00">행정구역</h4>
        <danji-chip-group
          :options="regionNames"
          v-model="selectedRegion"
          @update:modelValue="handleRegionChange"
        />
      </div>

      <div class="mb-[4.4rem]" v-if="shouldShowCitySelector">
        <h4 class="mb-[1rem] text-Black-2 Body00">지역(시/군/구)</h4>
        <danji-chip-group :options="cityNames" v-model="selectedCity" />
      </div>

      <div class="flex justify-center mt-auto mb-[0.8rem]">
        <danji-button
          variant="large"
          @click="emit('confirm', selectedRegion, selectedCity)"
          :disabled="isButtonDisabled"
          >확인</danji-button
        >
      </div>
    </div>
  </div>
</template>
