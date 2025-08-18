<script setup lang="ts">
import { ref, onBeforeUnmount, nextTick } from 'vue'
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import Layout from '@/components/layout/Layout.vue'
import VueQr from 'qrcode.vue'
import type { Level, RenderAs, GradientType, ImageSettings } from 'qrcode.vue'
import danjiLogoMain from '@/assets/images/danji-logo-main.png'
import { BrowserMultiFormatReader, Result } from '@zxing/library'
import { useRouter } from 'vue-router'
import { showSuccessToast, showWarningToast, showErrorToast } from '@/utils/toast'

const router = useRouter()

type PaymentType = 'field' | 'qr'

const selectedPayment = ref<PaymentType>('field')

const videoRef = ref<HTMLVideoElement | null>(null)
const resultText = ref<string>('')
const isScanning = ref<boolean>(false)
const scanError = ref<string>('')

let codeReader: BrowserMultiFormatReader | null = null

const selectPayment = async (type: PaymentType) => {
  selectedPayment.value = type

  if (type === 'qr') {
    try {
      await nextTick()
      await startScan()
    } catch (error) {
      showErrorToast('QR 스캔을 시작할 수 없습니다.')
      scanError.value = 'QR 스캔을 시작할 수 없습니다.'
    }
  } else {
    stopScan()
  }
}

const startScan = async () => {
  if (!videoRef.value || isScanning.value) return // 이미 스캔 중이면 중복 실행 방지

  codeReader = new BrowserMultiFormatReader()
  isScanning.value = true

  try {
    const devices = await codeReader.listVideoInputDevices()

    if (devices.length === 0) {
      scanError.value = '카메라 장치를 찾을 수 없습니다.'
      isScanning.value = false
      return
    }

    let selectedDevice = devices[0]

    const backCamera = devices.find((device) =>
      ['back', 'rear', 'environment'].some((keyword) =>
        device.label.toLowerCase().includes(keyword),
      ),
    )

    if (backCamera) {
      selectedDevice = backCamera
    }

    codeReader.decodeFromVideoDevice(
      selectedDevice.deviceId,
      videoRef.value,
      (result: Result | undefined) => {
        if (result) {
          resultText.value = result.getText()
          router.push('/pay')
          stopScan()
        }
      },
    )
  } catch (err) {
    const errorMsg = '카메라 접근 권한이 필요합니다.'
    showErrorToast(errorMsg)
    scanError.value = errorMsg
    isScanning.value = false
  }
}

const stopScan = () => {
  codeReader?.reset()
  isScanning.value = false
}

onBeforeUnmount(() => {
  stopScan()
})

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
  excavate: true,
})

const gradient = ref(false)
const gradientType = ref<GradientType>('linear')
const gradientStartColor = ref('#000000')
const gradientEndColor = ref('#38bdf8')

const handleClose = () => {
  router.push('/home')
}
</script>
<template>
  <layout :header-type="'pay'" :is-bottom-nav="false" @right-click="handleClose">
    <template #content>
      <div class="w-full h-full bg-Gray-0 overflow-hidden">
        <div class="w-full h-full flex flex-col items-center justify-center">
          <section
            class="absolute top-[8.9rem] z-20 flex items-center justify-center mt-[1.6rem] col gap-[1rem]"
          >
            <danji-chip
              class="w-[14.9rem] h-[4.6rem] text-Head04"
              :is-icon="false"
              :is-active="selectedPayment === 'field'"
              @click="selectPayment('field')"
            >
              현장결제</danji-chip
            >
            <danji-chip
              class="w-[14.9rem] h-[4.6rem] text-Head04"
              :is-icon="false"
              :is-active="selectedPayment === 'qr'"
              @click="selectPayment('qr')"
            >
              QR스캔</danji-chip
            >
          </section>
          <div
            v-if="selectedPayment === 'field'"
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

          <div
            v-show="selectedPayment === 'qr'"
            class="relative flex flex-col items-center w-full h-full"
          >
            <video
              ref="videoRef"
              class="w-full h-full bg-Gray-4 object-cover"
              autoplay
              muted
              playsinline
            ></video>
            <div v-if="scanError" class="absolute top-20 bg-red-500 text-white px-4 py-2 rounded">
              {{ scanError }}
            </div>

            <div
              class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <div class="w-[20rem] h-[20rem] border-4 border-Yellow-0 rounded-[1rem] mb-4"></div>

              <p class="text-White-0 text-lg font-bold Body0">QR을 스캔하세요</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </layout>
</template>
<style scoped></style>
