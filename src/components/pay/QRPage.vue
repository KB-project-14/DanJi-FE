<script setup lang="ts">
import { ref } from 'vue'
import DanjiChip from '../common/chip/DanjiChip.vue'
import Layout from '../layout/Layout.vue'

type PaymentType = 'field' | 'qr'

const selectedPayment = ref<PaymentType>('field')

const selectPayment = (type: PaymentType) => {
  selectedPayment.value = type
}
</script>
<template>
  <Layout :header-type="'pay'" :is-bottom-nav="false">
    <template #content>
      <div class="w-full h-full bg-Gray-0">
        <section class="relative z-10 flex items-center justify-center pt-[1.6rem] col gap-[1rem]">
          <DanjiChip
            class="w-[14.9rem] h-[4.6rem] text-Head04"
            :is-icon="false"
            :is-active="selectedPayment === 'field'"
            @click="selectPayment('field')"
          >
            현장결제</DanjiChip
          >
          <DanjiChip
            class="w-[14.9rem] h-[4.6rem] text-Head04"
            :is-Icon="false"
            :is-active="selectedPayment === 'qr'"
            @click="selectPayment('qr')"
          >
            QR스캔</DanjiChip
          >
        </section>
        <!-- 하얀 네모 (전체 화면 중앙에 배치) -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-[26.1rem] h-[26.1rem] bg-White-0 shadow-sm rounded-lg"></div>
        </div>
      </div>
    </template>
  </Layout>
</template>
<style scoped></style>
