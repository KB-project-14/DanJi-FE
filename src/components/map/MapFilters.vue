<script setup lang="ts">
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import DanjiChipGroup from '@/components/common/chip/DanjiChipGroup.vue'

interface Props {
  selectedFilter: string
  selectedCity: string
  filterOptions: string[]
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
  <div class="overflow-x-auto scrollbar-hide">
    <div class="flex items-center px-[1.6rem] mt-[2.2rem] min-w-max">
      <danji-chip :is-icon="true" :is-active="true" @click="$emit('filter-chip-click')">
        {{ foldLocalStoreModal ? '현재 위치' : selectedCity }}
      </danji-chip>

      <danji-chip-group
        :options="filterOptions"
        :model-value="selectedFilter"
        class="ms-[1rem]"
        @update:model-value="$emit('update:selected-filter', $event)"
      />
    </div>
  </div>
</template>
