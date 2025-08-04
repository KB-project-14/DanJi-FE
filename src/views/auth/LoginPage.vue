<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import DanjiInput from '@/components/common/form/DanjiInput.vue'
import { Lock, User, ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')

async function onLogin() {
  try {
    const res = await axios.post('http://localhost:8080/api/members/login', {
      username: username.value,
      password: password.value,
    })

    // 로그인 성공 시 토큰 저장
    localStorage.setItem('EXIT_LOGIN_TOKEN', res.data.accessToken)
    localStorage.setItem('EXIT_LOGIN_REFRESH_TOKEN', res.data.refreshToken)

    alert('로그인 성공!')
    router.push('/home')
  } catch (err) {
    console.error(err)
    alert('로그인 실패!')
  }
}
</script>

<template>
  <Layout header-type="basic" :is-bottom-nav="false" :show-left-icon="false">
    <template #content>
      <div class="flex flex-col items-center bg-white box-border p-[24px]">
        <div class="text-center mt-[24px] mb-[32px]">
          <img
            src="@/assets/images/danji-logo-main.png"
            alt="단지 로고"
            class="h-[60px] mb-[12px] ml-[50px]"
          />
          <p class="text-[14px] leading-[1.6] text-[#666666] mt-[30px]">
            단 하나의 지갑이면 충분해요<br />
            모든 지갑을 하나로, 단지에서 시작하세요 😊
          </p>
        </div>

        <div class="w-[365px] bg-white rounded-[12px] p-[24px] flex flex-col gap-[3px] mt-[25px]">
          <!-- 아이디 입력 -->
          <div class="h-[64px] flex items-center relative">
            <danji-input
              v-model="username"
              placeholder="아이디를 입력해주세요."
              aria-label="아이디"
              autocomplete="username"
            >
              <template #icon>
                <User
                  class="absolute left-[25px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] pointer-events-none text-[#d9d9d9]"
                />
              </template>
            </danji-input>
          </div>

          <!-- 비밀번호 입력 -->
          <div class="h-[64px] flex items-center relative">
            <danji-input
              v-model="password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              aria-label="비밀번호"
              autocomplete="current-password"
            >
              <template #icon>
                <Lock
                  class="absolute left-[25px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] pointer-events-none text-[#d9d9d9]"
                />
              </template>
            </danji-input>
          </div>

          <!-- 회원가입 링크 -->
          <router-link
            to="/signup"
            class="flex items-center justify-end text-[13px] text-[#c7c7c7] mt-[4px] mb-[-20px] mr-[10px]"
          >
            단지의 첫 지갑을 만들어볼까요?
            <span class="mx-[4px]"></span>
            <strong class="font-normal">회원가입</strong>
            <ChevronRight class="w-[14px] h-[14px] stroke-[2.5] text-[#c7c7c7]" />
          </router-link>
        </div>

        <!-- 로그인 버튼 -->
        <button
          class="w-full max-w-[360px] mt-[20px] py-[16px] text-[16px] font-medium text-white bg-[#60584c] rounded-[12px] cursor-pointer"
          @click="onLogin"
        >
          로그인
        </button>
      </div>
    </template>
  </Layout>
</template>

<style scoped lang="postcss">
:deep(input) {
  @apply h-[56px] pl-[48px] text-[15px] leading-[44px];
}
</style>
