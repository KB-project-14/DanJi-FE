<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import DanjiButton from '@/components/common/button/DanjiButton.vue'
import Layout from '@/components/layout/Layout.vue'
import checkboxSelected from '@/assets/icons/checkbox-activated.svg'
import checkboxUnselected from '@/assets/icons/checkbox-inactivated.svg'

import LocalPayFailModal from '@/components/common/modal/LocalPayFailModal.vue'
import CashPayFailModal from '@/components/common/modal/CashPayFailModal.vue'

import { useRouter } from 'vue-router'
import PayInfoModal from '@/components/common/modal/PayInfoModal.vue'
import type { payRequestDtoType } from '@/types/pay/payTypes'
import { useMemberStore } from '@/stores/useMemberStore'
import { useWalletStore } from '@/stores/useWalletStore'

const router = useRouter()
const memberStore = useMemberStore()
const walletStore = useWalletStore()

// 결제 방식 타입 (최대 하나만 선택)
type PaymentType = 'local' | 'cash'

const selectedPayment = ref<PaymentType>('local')
const showLocalFailModal = ref(false)
const showCashFailModal = ref(false)
const showInfoModal = ref(false)

const currentLocation = computed(() => memberStore.currentLocation)
console.log('현재 위치:', currentLocation.value)

const localBalance = computed(() => currentLocalWallet.value?.balance || 0)
const cashBalance = computed(() => walletStore.cashWallet?.balance || 0)

console.log('현금계좌 잔액', cashBalance.value)
console.log('지역화폐 잔액', localBalance.value)

// 현재 지역의 지역화폐 찾기
const currentLocalWallet = computed(() => {
  const location = currentLocation.value
  if (!location) return null

  return (
    walletStore.localWallets.find((wallet) => {
      return (
        // 임시로 설정(추후 백엔드 수정 후 수정 예정)
        wallet.walletId === location ||
        wallet.localCurrencyName?.includes(
          location.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, ''),
        )
      )
    }) || null
  )
})

const paymentAmount = ref(30000) // 전체 결제요금 임시 설정
const localPaymentAmount = ref(paymentAmount.value) // 지역화폐로 결제할 금액

// 임시로 지정한 post body 내용들
const paymentData = computed((): payRequestDtoType => {
  return {
    availableMerchantId: '12DF8BC1-30A4-4608-A33D-50CC939C4430', // 임시로 가맹점 ID 설정(고정)
    inputAmount: localPaymentAmount.value,
    localWalletId: '74695305-1379-4FBE-A780-8ECB56FAB441', //추후 pinia에서 전역 값 가져오기
    merchantAmount: paymentAmount.value,
    type: selectedPayment.value === 'local' ? 'LOCAL_CURRENCY' : 'GENERAL',
    walletPin: '',
  }
})

// 컴포넌트 마운트 시 위치 정보 및 지갑 정보 확인
onMounted(() => {
  if (!currentLocation.value) {
    console.warn('⚠️ 위치 정보가 없습니다.')
  }

  if (!currentLocalWallet.value) {
    console.warn('⚠️ 현재 지역의 지역화폐 지갑이 없습니다.')
  }

  // 지역화폐 여부에 따라 초기 결제 방식 자동 선택
  if (currentLocalWallet.value && localBalance.value > 0) {
    selectedPayment.value = 'local'
  } else {
    selectedPayment.value = 'cash'
  }
})

// 결제 방식 선택 함수 (라디오 버튼처럼 동작)
const selectPayment = (type: PaymentType) => {
  // 지역화폐 선택 시 해당 지역의 지갑이 있는지 확인
  if (type === 'local' && !currentLocalWallet.value) {
    alert('해당 지역의 지역화폐 지갑이 없습니다.')
    return
  }
  selectedPayment.value = type
}

// 결제 버튼 클릭 함수
const onClickPay = () => {
  if (selectedPayment.value === null) return

  if (selectedPayment.value === 'local') {
    if (localPaymentAmount.value === 0) return // 지역화폐 0원 결제 방지

    // 1. 지역화폐 잔액 부족 확인
    if (localPaymentAmount.value > localBalance.value) {
      showLocalFailModal.value = true
      return
    }

    // 2. 나머지 금액(일반 결제)이 현금 잔액보다 큰지 확인
    const remainingAmount = paymentAmount.value - localPaymentAmount.value
    if (remainingAmount > cashBalance.value) {
      alert('현금 계좌 잔액이 부족합니다.')
      return
    }
  } else if (selectedPayment.value === 'cash') {
    // 3. 현금 계좌 잔액이 전체 결제 금액보다 적은지 확인
    if (paymentAmount.value > cashBalance.value) {
      alert('현금 계좌 잔액이 부족합니다.')
      return
    }
  }

  // 모든 검증 통과 시 결제 정보 모달 표시
  showInfoModal.value = true
}

const displayAmount = computed(() => localPaymentAmount.value.toLocaleString())

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  // 숫자만 추출
  const numericValue = value.replace(/[^\d]/g, '')
  const cleanedValue = numericValue.replace(/^0+/, '')

  // 즉시 input 값 업데이트
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
  return false
})

const handleInfoConfirm = async () => {
  showInfoModal.value = false

  router.push({
    path: '/pay-pin',
    state: {
      paymentData: JSON.stringify(paymentData.value),
    },
  })
}
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
      <div class="flex flex-col items-center px-[1.6rem] pt-[1.1rem] bg-Gray-0">
        <!-- 결제 금액 섹션 -->
        <section
          class="relative flex flex-col w-full h-[10rem] px-[2.4rem] py-[2rem] mb-[1.4rem] bg-White-0 rounded-[1.6rem]"
        >
          <span class="text-Black-2 Head03">전체 금액</span>
          <span class="absolute bottom-[2rem] right-[2.4rem] text-Yellow-0 Head03">
            {{ paymentAmount.toLocaleString() }}원</span
          >
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
              <div class="relative w-[21rem] aspect-[1586/1000] rounded-[1.6rem] bg-Gray-10">
                <img
                  :src="`http://danji.cloud/static/images/localCurrency/gunsan.jpg`"
                  alt="지역화폐-카드-이미지"
                />
                <div
                  class="absolute flex flex-col bottom-[1.4rem] left-[2.1rem] px-[0.7rem] py-[0.2rem] bg-White-1/50"
                >
                  <span class="text-Black-1 Head03">부산페이</span>
                  <span class="text-Black-2 Body01">부산 지역화폐</span>
                </div>
              </div>
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
          </div>
        </section>

        <!-- 결제할 금액 나타내는 섹션 -->
        <section
          v-if="selectedPayment === 'local'"
          class="relative flex flex-col w-full px-[2.4rem] py-[2rem] mb-[2.1rem] bg-White-0 rounded-[1.6rem]"
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
            class="text-Red-0 Body03 mt-[0.7rem]"
          >
            지역화폐 잔액({{ localBalance.toLocaleString() }}원)을 초과했습니다.
          </p>
        </section>
        <danji-button
          class="w-[34.3rem] h-[5.8rem] mb-[3rem]"
          @click="onClickPay"
          :disabled="isPayDisabled"
          >결제하기</danji-button
        >
      </div>
      <local-pay-fail-modal v-if="showLocalFailModal" @close="showLocalFailModal = false" />
      <cash-pay-fail-modal v-if="showCashFailModal" @close="showCashFailModal = false" />
      <pay-info-modal
        :is-open="showInfoModal"
        @cancel="showInfoModal = false"
        @confirm="handleInfoConfirm"
      />
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
