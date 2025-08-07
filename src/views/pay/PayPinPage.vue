<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import Layout from '@/components/layout/Layout.vue'
import { useSignUpStore } from '@/stores/signupStore'
import usePostPayment from '@/composables/queries/payment/usePostPayment'
import type { payRequestDtoType } from '@/types/pay/payTypes'

const router = useRouter()
const signUpStore = useSignUpStore()
const { makePayment, isPending } = usePostPayment()

const currentPin = ref('')
const numbers = ref([1, 2, 3, 4, 5, 6, 7, 8, 9])
const paymentData = ref<payRequestDtoType | null>(null)

onMounted(() => {
  const state = history.state
  if (state?.paymentData) {
    paymentData.value = JSON.parse(state.paymentData)
  } else {
    alert('잘못된 접근입니다.')
    router.push('/pay')
  }
})

function pressNumber(num: number) {
  if (currentPin.value.length < 4) currentPin.value += num.toString()
}

function deleteNumber() {
  currentPin.value = currentPin.value.slice(0, -1)
}

function resetPin() {
  currentPin.value = ''
}

async function confirmPin() {
  if (currentPin.value.length < 4) {
    alert('결제 비밀번호 4자리를 입력해주세요.')
    return
  }

  if (!paymentData.value) {
    alert('결제 정보가 없습니다.')
    router.push('/pay')
    return
  }

  try {
    // walletPin 업데이트
    paymentData.value.walletPin = currentPin.value

    await makePayment(paymentData.value)

    router.push({
      path: '/pay-complete',
      state: {
        status: 'success',
      },
    })
  } catch (error) {
    router.push({
      path: '/pay-complete',
      state: {
        status: 'failed',
      },
    })
  }
}
</script>

<template>
  <layout
    header-type="basic"
    :header-title="'결제하기'"
    :is-bottom-nav="false"
    :show-left-icon="true"
  >
    <template #content>
      <div class="w-full border-t border-gray-300 mt-0"></div>
      <div class="flex flex-col h-screen bg-white">
        <!-- 문구 영역 -->
        <div class="mt-10 mb-10 px-10 w-full">
          <p class="text-black text-3xl font-extrabold leading-snug whitespace-pre-line text-left">
            결제비밀번호 4자리를<br />
            입력해주세요.
          </p>
        </div>

        <!-- 원 영역 -->
        <div class="flex justify-center space-x-10 mt-8">
          <div
            v-for="i in 4"
            :key="i"
            class="w-10 h-10 rounded-full border-2 transition"
            :class="{ '!bg-[#85714D]': currentPin.length >= i }"
            style="border-color: #85714d"
          ></div>
        </div>

        <!-- 키패드 + 버튼 전체 래퍼 -->
        <div class="mt-auto pb-40">
          <div
            class="bg-white rounded-t-3xl px-8 pt-6 pb-10 w-full shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <div class="grid grid-cols-3 gap-6 mb-1">
              <button
                v-for="num in numbers"
                :key="num"
                class="py-6 text-3xl font-bold rounded-full hover:bg-gray-100 transition"
                @click="pressNumber(num)"
              >
                {{ num }}
              </button>

              <button class="py-6 text-3xl font-bold" @click="resetPin">초기화</button>
              <button class="py-6 text-3xl font-bold" @click="pressNumber(0)">0</button>
              <button class="py-6 flex justify-center items-center" @click="deleteNumber">
                <ChevronLeft class="w-8 h-8 text-black hover:text-black transition" />
              </button>
            </div>
          </div>

          <!-- 확인 버튼 -->
          <div class="flex justify-center mt-6 mb-4">
            <button
              class="w-[315px] py-5 text-3xl text-white bg-[#4e3d31] rounded-xl cursor-pointer disabled:bg-[#cccccc] disabled:text-white disabled:cursor-not-allowed"
              :disabled="currentPin.length < 4"
              @click="confirmPin"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </template>
  </layout>
</template>
