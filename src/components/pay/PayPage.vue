<script setup lang="ts">
import DanjiButton from '../common/button/DanjiButton.vue'
import Layout from '../layout/Layout.vue'
import PayModal from '@/components/common/modal/PayModal.vue'
import checkboxSelected from '@/assets/icons/checkbox-activated.svg'
import checkboxUnselected from '@/assets/icons/checkbox-inactivated.svg'
import { ref } from 'vue'

// 결제 방식 타입 (최대 하나만 선택)
type PaymentType = 'local' | 'cash' | null

const selectedPayment = ref<PaymentType>(null)
const showModal = ref(false)

// 실제로는 API 등에서 가져온 지역화폐 잔액
const localBalance = ref(50000) // 예: 5만원
const paymentAmount = ref(60000) // 예: 결제금액 6만원

// 결제 방식 선택 함수 (라디오 버튼처럼 동작)
const selectPayment = (type: PaymentType) => {
  selectedPayment.value = selectedPayment.value === type ? null : type
}

// 결제 버튼 클릭 함수
const onClickPay = () => {
  if (selectedPayment.value === 'local' && localBalance.value < paymentAmount.value) {
    showModal.value = true
    return
  }
}

// 모달 닫기 함수 - 추가 필요시 사용
// const closeModal = () => {
//   showModal.value = false
// }
</script>
<template>
  <Layout
    :header-type="'basic'"
    :header-title="'결제하기'"
    :show-right-icon="true"
    :is-bottom-nav="false"
  >
    <template #content>
      <div class="relative flex flex-col items-center h-full px-[1.6rem] pt-[1.1rem] bg-Gray-0">
        <!-- 결제 금액 섹션 -->
        <section
          class="relative flex flex-col w-full h-[10rem] px-[2.4rem] py-[2rem] mb-[1.4rem] bg-White-0 rounded-[1.6rem]"
        >
          <span class="text-Black-2 Head03">결제 금액</span>
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
        <DanjiButton
          class="absolute bottom-0 w-[34.3rem] h-[5.8rem] mb-[3rem]"
          @click="onClickPay"
          :disabled="selectedPayment === null"
          >결제하기</DanjiButton
        >
      </div>
      <PayModal v-if="showModal" />
    </template>
  </Layout>
</template>
<style scoped></style>
