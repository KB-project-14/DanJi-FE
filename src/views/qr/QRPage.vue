<script setup lang="ts">
import { ref } from 'vue'
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import Layout from '@/components/layout/Layout.vue'
import VueQr from 'qrcode.vue'
import type { Level, RenderAs, GradientType, ImageSettings } from 'qrcode.vue'
import danjiLogoMain from '@/assets/images/danji-logo-main.png'

type PaymentType = 'field' | 'qr'

const selectedPayment = ref<PaymentType>('field')

const selectPayment = (type: PaymentType) => {
  selectedPayment.value = type
}

// QR 코드 관련 변수
const value = ref('qrcode')
const level = ref<Level>('M')
const renderAs = ref<RenderAs>('svg')
const background = ref('#ffffff')
const foreground = ref('#000000')
const margin = ref(0)

const imageSettings = ref<ImageSettings>({
  src: danjiLogoMain,
  width: 30,
  height: 30,
  // x: 10,
  // y: 10,
  excavate: true,
})

const gradient = ref(false)
const gradientType = ref<GradientType>('linear')
const gradientStartColor = ref('#000000')
const gradientEndColor = ref('#38bdf8')
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
            :is-icon="false"
            :is-active="selectedPayment === 'qr'"
            @click="selectPayment('qr')"
          >
            QR스캔</DanjiChip
          >
        </section>
        <!-- QR 영역 (전체 화면 중앙에 배치) -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="flex items-center justify-center w-[26.1rem] h-[26.1rem] bg-White-0 shadow-sm rounded-lg"
          >
            <vue-qr
              class="w-[22.9rem] h-[22.9rem]"
              :value="value"
              :level="level"
              :render-as="renderAs"
              :background="background"
              :foreground="foreground"
              :gradient="gradient"
              :gradient-type="gradientType"
              :gradient-start-color="gradientStartColor"
              :gradient-end-color="gradientEndColor"
              :image-settings="imageSettings"
            ></vue-qr>
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>
<style scoped></style>
