<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import Layout from '@/components/layout/Layout.vue'
import { useMemberStore } from '@/stores/useMemberStore'
import usePostPayment from '@/composables/queries/payment/usePostPayment'
import type { payRequestDtoType } from '@/types/pay/payTypes'
import { useUiStore } from '@/stores/useUiStore'
import { AxiosError } from 'axios'
import { showWarningToast, showErrorToast } from '@/utils/toast'

const store = useMemberStore()
const router = useRouter()
const { makePayment, isPending } = usePostPayment()

const currentPin = ref('')
const numbers = ref([1, 2, 3, 4, 5, 6, 7, 8, 9])
const paymentData = ref<payRequestDtoType | null>(null)

onMounted(() => {
  const state = history.state
  if (state?.paymentData) {
    paymentData.value = JSON.parse(state.paymentData)
  } else {
    showWarningToast('잘못된 접근입니다.')
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
    showWarningToast('결제 비밀번호 4자리를 입력해주세요.')
    return
  }

  if (!paymentData.value) {
    showErrorToast('결제 정보가 없습니다.')
    router.push('/pay')
    return
  }

  try {
    paymentData.value.walletPin = currentPin.value

    await makePayment(paymentData.value)

    router.push({
      path: '/pay-complete',
      state: {
        status: 'success',
      },
    })
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error?.response?.data?.error?.message?.includes('결제 비밀번호가 일치하지 않습니다')
    ) {
      // useUiStore().setNextToast({
      //   type: 'error',
      //   msg: '결제 비밀번호가 일치하지 않습니다.',
      //   opts: { position: 'bottom-center', autoClose: 1000 },
      // })

      resetPin()

      await router.push('/pay')
      return
    }

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
        <div class="mt-10 mb-10 px-10 w-full">
          <p class="text-black text-3xl font-extrabold leading-snug whitespace-pre-line text-left">
            결제비밀번호 4자리를<br />
            입력해주세요.
          </p>
        </div>

        <div class="flex justify-center space-x-10 mt-8">
          <div
            v-for="i in 4"
            :key="i"
            class="w-10 h-10 rounded-full border-2 transition"
            :class="{ '!bg-[#85714D]': currentPin.length >= i }"
            style="border-color: #85714d"
          ></div>
        </div>

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

          <div class="flex justify-center mt-6 mb-4">
            <button
              class="w-[315px] py-5 text-3xl text-white bg-[#4e3d31] rounded-xl cursor-pointer disabled:bg-[#cccccc] disabled:text-white disabled:cursor-not-allowed"
              :disabled="currentPin.length < 4 || isPending"
              @click="confirmPin"
            >
              {{ isPending ? '결제 처리 중..' : '확인' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </layout>
</template>
