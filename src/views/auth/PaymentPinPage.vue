<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import Layout from '@/components/layout/Layout.vue'
import { useMemberStore } from '@/stores/useMemberStore'
import { signUp } from '@/api/auth'
import type { SignUpRequest } from '@/types/auth'
import type { AxiosError } from 'axios'

const store = useMemberStore()
const router = useRouter()

const step = ref(1)
const firstPin = ref('')
const currentPin = ref('')
const numbers = ref([1, 2, 3, 4, 5, 6, 7, 8, 9])

function pressNumber(num: number) {
  if (currentPin.value.length < 4) currentPin.value += num.toString()
}

function deleteNumber() {
  currentPin.value = currentPin.value.slice(0, -1)
}

function resetPin() {
  currentPin.value = ''
  firstPin.value = ''
  step.value = 1
}

async function confirmPin() {
  if (step.value === 1) {
    if (currentPin.value.length < 4) {
      alert('핀번호 4자리를 입력해주세요.')
      return
    }
    firstPin.value = currentPin.value
    currentPin.value = ''
    step.value = 2
    return
  }

  if (currentPin.value.length < 4) {
    alert('핀번호 4자리를 입력해주세요.')
    return
  }

  if (firstPin.value !== currentPin.value) {
    alert('핀번호가 일치하지 않습니다. 다시 시도해주세요.')
    resetPin()
    return
  }

  try {
    const signUpPayload: SignUpRequest = {
      name: store.name,
      username: store.username,
      password: store.password,
      paymentPin: firstPin.value,
    }

    await signUp(signUpPayload)
    alert('회원가입 완료!')
    store.$reset()
    router.push('/login')
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>
    const message = error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.'
    alert(message)
  }
}
</script>

<template>
  <Layout
    header-type="basic"
    :header-title="'비밀번호 입력'"
    :is-bottom-nav="false"
    :show-left-icon="false"
  >
    <template #content>
      <!-- 왼쪽 상단 아이콘: 회원가입 페이지로 이동 -->
      <button class="absolute top-11 left-10 z-10" @click="router.push('/signup')">
        <ChevronLeft class="w-10 h-10 text-gray-500 hover:text-gray-800" />
      </button>

      <div class="w-full border-t border-gray-300 mt-0"></div>
      <div class="flex flex-col h-screen bg-white">
        <!-- 문구 영역 -->
        <div class="mt-10 mb-10 px-10 w-full">
          <p class="text-black text-3xl font-extrabold leading-snug whitespace-pre-line text-left">
            {{
              step === 1
                ? '결제비밀번호 4자리를\n입력해주세요.'
                : '결제비밀번호 4자리를\n다시 한번 입력해주세요.'
            }}
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
  </Layout>
</template>
