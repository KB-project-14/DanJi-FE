<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  options: string[]
}>()

const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

const handleSelect = (value: string) => {
  emit('select', value)
}
</script>

<template>
  <div
    class="absolute z-50 w-full mt-[0.4rem] bg-White-0 border-[2px] border-Gray-1 rounded-[1.2rem] shadow-lg overflow-hidden"
  >
    <div class="max-h-[20rem] overflow-y-auto">
      <div
        v-for="(option, index) in options"
        :key="option"
        class="px-[1.4rem] py-[1.1rem] Body00 cursor-pointer transition-all duration-150 hover:bg-Gray-1 active:bg-Gray-2"
        :class="[
          option === modelValue ? 'bg-Gray-3 text-White-1' : 'text-Black-1',
          index === 0 ? 'rounded-t-[1rem]' : '',
          index === options.length - 1 ? 'rounded-b-[1rem]' : '',
        ]"
        @click="handleSelect(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>
