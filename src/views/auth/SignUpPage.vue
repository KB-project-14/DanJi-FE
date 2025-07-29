<template>
  <Layout
    :header-type="'basic'"
    :header-title="'회원가입'"
    :is-bottom-nav="false"
    :show-left-icon="true"
  >
    <template #content>
      <div class="signup-page">
        <!-- 흰 배경 카드 안에 danji-input 3개 -->
        <div class="form-card">
          <label for="name">이름</label>
          <danji-input v-model="name" placeholder="이름을 입력해주세요." />
          <label for="ID">아이디</label>
          <danji-input v-model="username" placeholder="아이디를 입력해주세요." />
          <label for="password">비밀번호</label>
          <danji-input v-model="password" type="password" placeholder="비밀번호를 입력해주세요." />
        </div>

        <!-- 버튼 -->
        <button class="submit-btn" :disabled="!isValid" @click="onSignUp">회원가입 하기</button>
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Layout 컴포넌트 import 경로는 실제 위치에 맞게 조정해주세요
import Layout from '@/components/layout/Layout.vue'
import DanjiInput from '@/components/common/form/DanjiInput.vue'

const router = useRouter()
const name = ref('')
const username = ref('')
const password = ref('')

const isValid = computed(() => !!name.value && !!username.value && !!password.value)

function onSignUp() {
  if (!isValid.value) return
  // TODO: 회원가입 API 호출
  console.log({ name: name.value, username: username.value, password: password.value })
  router.push('/login')
}
</script>

<style scoped>
.signup-page {
  padding: 24px;
  height: 595px;
  background: #f5f6f8;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-card {
  width: 100%;
  max-width: 360px;
  height: 400px;
  margin: 30px auto 20px; /* 위쪽 40px, 좌우 auto, 아래 0 */

  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  padding-top: -10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 35px;
}

.submit-btn {
  width: 100%;
  max-width: 360px;
  margin-top: 24px;
  padding: 16px;
  font-size: 16px;
  color: #ffffff;
  background-color: #4e3d31;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}
.submit-btn:disabled {
  background-color: #cccccc;
  color: #ffffff;
  cursor: not-allowed;
  margin-top: 24px;
}

.form-card label {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: -30px;
  margin-top: 10px;
  margin-left: 5px;
}
</style>
