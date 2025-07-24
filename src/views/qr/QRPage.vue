<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import Layout from '@/components/layout/Layout.vue'
import VueQr from 'qrcode.vue'
import type { Level, RenderAs, GradientType, ImageSettings } from 'qrcode.vue'
import danjiLogoMain from '@/assets/images/danji-logo-main.png'
import { BrowserMultiFormatReader, Result } from '@zxing/library'
import { useRouter } from 'vue-router'

const router = useRouter()

type PaymentType = 'field' | 'qr'

const selectedPayment = ref<PaymentType>('field')

// QR 스캔 관련 변수
const videoRef = ref<HTMLVideoElement | null>(null)
const resultText = ref<string>('') // 스캔된 QR 코드 결과 텍스트
const isScanning = ref<boolean>(false) // 현재 스캔 중인지 상태
const scanError = ref<string>('') // 스캔 에러 메시

// QR 리더 인스턴스 (전역 변수로 관리)
let codeReader: BrowserMultiFormatReader | null = null

// 결제수단 선택 함수
const selectPayment = async (type: PaymentType) => {
  selectedPayment.value = type

  if (type === 'qr') {
    // QR스캔 탭 선택 시 카메라 스캔 시작
    await nextTick()
    await startScan()
  } else {
    // 현장결제 탭 선택 시 스캔 중지
    stopScan()
  }
}

// QR 스캔 시작
const startScan = async () => {
  if (!videoRef.value || isScanning.value) return // 이미 스캔 중이면 중복 실행 방지

  codeReader = new BrowserMultiFormatReader()
  isScanning.value = true

  try {
    const devices = await codeReader.listVideoInputDevices()

    if (devices.length === 0) {
      scanError.value = '카메라 장치를 찾을 수 없습니다.'
      return
    }

    // 후면 카메라 우선 선택 (모바일 환경 고려)
    let selectedDevice = devices[0] // 기본값: 첫 번째 카메라

    // 후면 카메라 찾기 (label에 'back', 'rear', 'environment' 포함)
    const backCamera = devices.find((device) =>
      ['back', 'rear', 'environment'].some((keyword) =>
        device.label.toLowerCase().includes(keyword),
      ),
    )

    if (backCamera) {
      selectedDevice = backCamera
    }

    console.log('선택된 카메라:', selectedDevice.label)

    codeReader.decodeFromVideoDevice(
      selectedDevice.deviceId,
      videoRef.value,
      (result: Result | undefined) => {
        if (result) {
          resultText.value = result.getText()
          router.push('/pay') // 스캔 성공 시 결제 페이지로 이동
          stopScan()
        }
      },
    )
  } catch (err) {
    console.error(err)
  }
}

// 스캔 중지
const stopScan = () => {
  codeReader?.reset()
  isScanning.value = false
}

onBeforeUnmount(() => {
  stopScan()
})

// QR 코드 생성 관련 변수
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
</script>
<template>
  <layout :header-type="'pay'" :is-bottom-nav="false">
    <template #content>
      <div class="w-full h-full bg-Gray-0">
        <section class="relative z-20 flex items-center justify-center pt-[1.6rem] col gap-[1rem]">
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

        <!-- QR / 현장결제 전환 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <!-- 현장결제 QR 생성-->
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

          <!-- QR스캔 선택 시 -->
          <div
            v-show="selectedPayment === 'qr'"
            class="absolute inset-0 flex flex-col items-center w-full h-full z-10 pt-[6rem]"
          >
            <video ref="videoRef" class="w-full h-full bg-Gray-4 object-cover" autoplay></video>

            <!-- 오버레이 (가이드 영역) -->
            <div
              class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <!--QR 코드 영역 표시용 박스 -->
              <div class="w-[20rem] h-[20rem] border-4 border-Yellow-0 rounded-[1rem] mb-4"></div>

              <!-- 안내 텍스트 -->
              <p class="text-White-0 text-lg font-bold Body0">QR을 스캔하세요</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </layout>
</template>
<style scoped></style>
