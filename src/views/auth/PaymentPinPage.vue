<template>
  <Layout header-type="basic" :is-bottom-nav="false" :show-left-icon="false">
    <div class="flex flex-col min-h-screen bg-white relative">
      <!-- 상단 헤더 -->
      <div
        class="relative w-full bg-white rounded-t-2xl py-12 text-center border-b border-gray-200"
      >
        <h2 class="text-3xl font-bold">비밀번호 설정</h2>
        <button class="absolute right-10 top-10" @click="goToSignUp">
          <X class="w-10 h-10 text-gray-500 hover:text-gray-800 transition" />
        </button>
      </div>

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

      <!-- 원 표시 영역 -->
      <div class="flex justify-center space-x-10 mt-8">
        <div
          v-for="i in 4"
          :key="i"
          class="w-10 h-10 rounded-full border-2 transition"
          :class="{ '!bg-[#85714D]': currentPin.length >= i }"
          style="border-color: #85714d"
        ></div>
      </div>

      <!-- 키패드 + 버튼 -->
      <div
        class="mt-auto bg-white rounded-t-3xl px-8 pt-6 pb-10 w-full shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
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

          <!-- 🔹 '초기화' 버튼으로 변경 -->
          <button class="py-6 text-3xl font-bold" @click="resetPin">초기화</button>

          <button class="py-6 text-3xl font-bold" @click="pressNumber(0)">0</button>
          <button class="py-6 flex justify-center items-center" @click="deleteNumber">
            <MoveLeft class="w-8 h-8 text-black hover:text-black transition" />
          </button>
        </div>
      </div>

      <!-- 확인 버튼 -->
      <div class="flex justify-center mt-6 mb-4 translate-y-[-20px]">
        <button
          class="w-[300px] py-5 text-3xl text-white bg-[#4e3d31] rounded-lg cursor-pointer disabled:bg-[#cccccc] disabled:text-white disabled:cursor-not-allowed"
          :disabled="currentPin.length < 4"
          @click="confirmPin"
        >
          확인
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { X, MoveLeft } from 'lucide-vue-next'

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

function confirmPin() {
  if (step.value === 1) {
    firstPin.value = currentPin.value
    currentPin.value = ''
    step.value = 2
  } else {
    if (firstPin.value === currentPin.value) {
      alert('비밀번호 설정 완료!')
      router.push('/login')
    } else {
      alert('비밀번호가 일치하지 않습니다. 다시 시도해주세요.')
      step.value = 1
      firstPin.value = ''
      currentPin.value = ''
    }
  }
}

function goToSignUp() {
  router.push('/signup')
}
</script>
