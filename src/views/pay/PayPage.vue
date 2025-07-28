<script setup lang="ts">
import { ref, computed } from 'vue'

import DanjiButton from '@/components/common/button/DanjiButton.vue'
import Layout from '@/components/layout/Layout.vue'
import checkboxSelected from '@/assets/icons/checkbox-activated.svg'
import checkboxUnselected from '@/assets/icons/checkbox-inactivated.svg'

import LocalPayFailModal from '@/components/common/modal/LocalPayFailModal.vue'
import CashPayFailModal from '@/components/common/modal/CashPayFailModal.vue'

import { useRouter } from 'vue-router'

const router = useRouter()

// 결제 방식 타입 (최대 하나만 선택)
type PaymentType = 'local' | 'cash' | null

const selectedPayment = ref<PaymentType>(null)
const showLocalFailModal = ref(false)
const showCashFailModal = ref(false)

const localBalance = ref(50000) // 실제로는 API에서 가져온 지역화폐 잔액
const paymentAmount = ref(600000) // 전체 결제요금 임시 설정 (6만원)
const localPaymentAmount = ref(paymentAmount) // 지역화폐로 결제할 금액

// 결제 방식 선택 함수 (라디오 버튼처럼 동작)
const selectPayment = (type: PaymentType) => {
  selectedPayment.value = selectedPayment.value === type ? null : type
}

// 결제 버튼 클릭 함수
const onClickPay = () => {
  if (selectedPayment.value === null) return
  if (localPaymentAmount.value === 0) return // 지역화폐 0원 결제 방지

  // 결제 금액보다 잔액이 부족한 경우(결제 수단별 분기)
  let isInsufficient = false

  // 지역화폐 결제의 경우 잔액 확인
  if (selectedPayment.value === 'local') {
    isInsufficient = localBalance.value < paymentAmount.value
  } else if (selectedPayment.value === 'cash') {
    // 일반결제는 현금 잔액과 비교
    isInsufficient = false // 임시로 false 설정
  }
  if (isInsufficient) {
    if (selectedPayment.value === 'local') {
      showLocalFailModal.value = true
    } else if (selectedPayment.value === 'cash') {
      showCashFailModal.value = true
    }
    return
  }

  router.push('/pay-complete')
}

const displayAmount = computed(() => localPaymentAmount.value.toLocaleString())

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  // 숫자만 추출
  const numericValue = value.replace(/[^\d]/g, '')
  const cleanedValue = numericValue.replace(/^0+/, '')

  // 즉시 input 값 업데이트 (문자 제거)
  target.value = cleanedValue ? parseInt(cleanedValue).toLocaleString() : ''

  // 상태 업데이트
  localPaymentAmount.value = parseInt(cleanedValue) || 0
}

// 결제버튼 비활성화 여부 판단 함수
const isPayDisabled = computed(() => {
  // 결제 수단 미선택 시 비활성화
  if (!selectedPayment.value) return true

  // 지역화폐 결제 선택 시
  if (selectedPayment.value === 'local') {
    // 0원 입력 또는 잔액 초과 시 비활성화
    if (localPaymentAmount.value === 0 || localPaymentAmount.value > localBalance.value) {
      return true
    }
  }

  // 그 외엔 활성화
  return false
})
</script>
<template>
  <layout
    :header-type="'basic'"
    :header-title="'결제하기'"
    :show-right-icon="true"
    :is-bottom-nav="false"
    @right-click="router.push('/home')"
  >
    <template #content>
      <div class="relative flex flex-col items-center h-full px-[1.6rem] pt-[1.1rem] bg-Gray-0">
        <!-- 결제 금액 섹션 -->
        <section
          class="relative flex flex-col w-full h-[10rem] px-[2.4rem] py-[2rem] mb-[1.4rem] bg-White-0 rounded-[1.6rem]"
        >
          <span class="text-Black-2 Head03">전체 금액</span>
          <span class="absolute bottom-[2rem] right-[2.4rem] text-Yellow-0 Head03"> 600,000원</span>
        </section>

        <!-- 결제 수단 섹션 -->
        <section
          class="relative flex flex-col w-full px-[2.4rem] pt-[2rem] pb-[2.5rem] mb-[3rem] bg-White-0 rounded-[1.6rem]"
        >
          <span class="text-Black-2 Head03">결제 수단</span>
          <div class="w-full h-[1px] mt-[0.5rem] mb-[1.8rem] bg-Gray-9" />

          <!-- 결제수단 체크박스 영역 / 재사용 가능할듯? -->
          <!-- 지역화폐 결제 -->
          <div class="flex flex-col items-center">
            <div
              class="flex items-center self-start mb-[0.5rem] cursor-pointer"
              @click="selectPayment('local')"
            >
              <!-- 원래 체크박스는 숨김 -->
              <input type="checkbox" class="sr-only" />

              <!-- 커스텀 체크박스 이미지  적용 -->
              <div class="mr-[1rem] w-[2.4rem] h-[2.4rem] flex-shrink-0">
                <img
                  :src="selectedPayment === 'local' ? checkboxSelected : checkboxUnselected"
                  :alt="
                    selectedPayment === 'local' ? '지역화폐-결제-체크됨' : '지역화폐-결제-체크-안됨'
                  "
                  class="w-full h-full"
                />
              </div>

              <span class="text-Black-1 Head04">지역화폐 결제</span>
            </div>

            <!-- 카드 div(체크됐을 때만 표시) -->
            <div v-if="selectedPayment === 'local'">
              <div class="w-[21rem] aspect-[1586/1000] rounded-[1.6rem] bg-Gray-10"></div>
            </div>
          </div>

          <div class="w-full h-[1px] mt-[2rem] mb-[0.8rem] bg-Gray-9" />

          <!-- 일반결제 -->
          <div class="flex flex-col items-center">
            <div
              class="flex items-center self-start mb-[0.8rem] cursor-pointer"
              @click="selectPayment('cash')"
            >
              <!-- 원래 체크박스는 숨김 -->
              <input type="checkbox" class="sr-only" />

              <!-- 커스텀 체크박스 이미지 적용 -->
              <div class="mr-[1rem] w-[2.4rem] h-[2.4rem] flex-shrink-0">
                <img
                  :src="selectedPayment === 'cash' ? checkboxSelected : checkboxUnselected"
                  :alt="selectedPayment === 'cash' ? '일반결제-체크됨' : '일반결제-체크-안됨'"
                  class="w-full h-full"
                />
              </div>

              <span class="text-Black-1 Head04">일반결제</span>
            </div>

            <!-- 카드 div(선택됐을 때만 표시) -->
            <div v-if="selectedPayment === 'cash'">
              <div class="w-[21rem] aspect-[1586/1000] rounded-[1.6rem] bg-Gray-10"></div>
            </div>
          </div>
        </section>

        <!-- 결제할 금액 나타내는 섹션 -->
        <section
          v-if="selectedPayment === 'local'"
          class="relative flex flex-col w-full px-[2.4rem] py-[2rem] mb-[1.4rem] bg-White-0 rounded-[1.6rem]"
        >
          <span class="text-Black-2 Head03">지역화폐로 결제할 금액</span>

          <div class="flex justify-center items-center mt-[1.5rem]">
            <input
              :value="displayAmount"
              @input="handleInput"
              type="text"
              class="w-full h-[5.4rem] Head03 text-right no-spin border border-Gray-2 rounded-[1.6rem] pr-[1.2rem] px-3"
              placeholder="결제할 금액을 입력해주세요"
            />
            <span class="top-1/2 mt-[2.2rem] ml-[0.5rem] -translate-y-1/2 text-Black-2 Head03"
              >원</span
            >
          </div>
          <p v-if="localPaymentAmount > paymentAmount" class="text-red-500 text-sm mt-[0.7rem]">
            총 결제 금액을 초과할 수 없습니다.
          </p>
          <p
            v-if="selectedPayment === 'local' && localPaymentAmount > localBalance"
            class="text-red-500 text-sm mt-[0.7rem]"
          >
            지역화폐 잔액({{ localBalance.toLocaleString() }}원)을 초과했습니다.
          </p>
        </section>
        <DanjiButton
          class="absolute bottom-0 w-[34.3rem] h-[5.8rem] mb-[3rem]"
          @click="onClickPay"
          :disabled="isPayDisabled"
          >결제하기</DanjiButton
        >
      </div>
      <LocalPayFailModal v-if="showLocalFailModal" @close="showLocalFailModal = false" />
      <CashPayFailModal v-if="showCashFailModal" @close="showCashFailModal = false" />
    </template>
  </layout>
</template>
<style scoped>
.no-spin::-webkit-inner-spin-button,
.no-spin::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
.no-spin {
  -moz-appearance: textfield;
}
</style>
