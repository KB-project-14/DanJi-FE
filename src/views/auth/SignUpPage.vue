<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { ChevronLeft } from 'lucide-vue-next'

import Layout from '@/components/layout/Layout.vue'
import DanjiInput from '@/components/common/form/DanjiInput.vue'

const router = useRouter()
const name = ref('')
const username = ref('')
const password = ref('')

const isValid = computed(() => !!name.value && !!username.value && !!password.value)

function onSignUp() {
  if (!isValid.value) return
  console.log({ name: name.value, username: username.value, password: password.value })
  router.push('/payment-pin')
}
</script>

<template>
  <Layout
    :header-type="'basic'"
    :header-title="'회원가입'"
    :is-bottom-nav="false"
    :show-left-icon="false"
  >
    <template #content>
      <div class="p-6 h-[595px] bg-[#f5f6f8] box-border flex flex-col items-center">
        <button class="absolute top-11 left-10" @click="router.push('/login')">
          <ChevronLeft class="w-10 h-10 text-gray-500 hover:text-gray-800" />
        </button>

        <div
          class="w-full max-w-[360px] h-[400px] mt-[30px] mb-[20px] mx-auto bg-white rounded-xl p-6 pt-[-10px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex flex-col gap-[35px]"
        >
          <label
            for="name"
            class="text-[16px] font-semibold text-black mb-[-30px] mt-[10px] ml-[5px]"
          >
            이름
          </label>
          <danji-input v-model="name" placeholder="이름을 입력해주세요." />

          <label
            for="ID"
            class="text-[16px] font-semibold text-black mb-[-30px] mt-[10px] ml-[5px]"
          >
            아이디
          </label>
          <danji-input v-model="username" placeholder="아이디를 입력해주세요." />

          <label
            for="password"
            class="text-[16px] font-semibold text-black mb-[-30px] mt-[10px] ml-[5px]"
          >
            비밀번호
          </label>
          <danji-input v-model="password" type="password" placeholder="비밀번호를 입력해주세요." />
        </div>

        <!-- 버튼 -->
        <button
          class="w-full max-w-[360px] mt-6 py-7 text-[16px] text-white bg-[#4e3d31] rounded-xl cursor-pointer disabled:bg-[#cccccc] disabled:text-white disabled:cursor-not-allowed"
          :disabled="!isValid"
          @click="onSignUp"
        >
          다음으로
        </button>
      </div>
    </template>
  </Layout>
</template>
