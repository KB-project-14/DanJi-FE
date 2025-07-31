<script setup lang="ts">
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import DanjiChipGroup from '@/components/common/chip/DanjiChipGroup.vue'

interface Props {
  selectedFilter: string
  selectedCity: string
  foldLocalStoreModal: boolean
}

interface Emits {
  (e: 'filter-chip-click'): void
  (e: 'update:selected-filter', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <!-- 필터 -->
  <div class="flex ms-[1.6rem] mt-[2.2rem]">
    <danji-chip :is-icon="true" :is-active="true" @click="$emit('filter-chip-click')">
      {{ foldLocalStoreModal ? '현재 위치' : selectedCity }}
    </danji-chip>

    <danji-chip-group
      :options="['전체', '음식점', '카페']"
      :model-value="selectedFilter"
      class="ms-[1rem]"
      @update:model-value="$emit('update:selected-filter', $event)"
    />
  </div>
</template>
