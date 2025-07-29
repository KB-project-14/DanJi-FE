<template>
  <Layout header-type="basic" :is-bottom-nav="false" :show-left-icon="false">
    <template #content>
      <div class="login-page">
        <!-- 1) 로고 + 설명 -->
        <div class="logo-box">
          <!-- src/assets/images/logo.png 에 로고 파일 넣어두세요 -->
          <img src="@/assets/images/danji-logo-main.png" alt="단지 로고" class="logo" />
          <p class="tagline">
            단 하나의 지갑이면 충분해요<br />
            모든 지갑을 하나로, 단지에서 시작하세요 😊
          </p>
        </div>

        <!-- 2) 흰 카드 : 입력창 2개 + 링크 -->
        <div class="form-card">
          <!-- 감싸는 div 하나 추가 -->
          <div class="input-wrapper">
            <danji-input
              v-model="username"
              placeholder="아이디를 입력해주세요."
              aria-label="아이디"
              autocomplete="username"
            >
              <template #icon> <User class="fake-input-icon" /> </template>
            </danji-input>
          </div>

          <div class="input-wrapper">
            <danji-input
              v-model="password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              aria-label="비밀번호"
              autocomplete="current-password"
            >
              <template #icon>
                <Lock class="fake-input-icon" />
              </template>
            </danji-input>
          </div>

          <router-link to="/signup" class="signup-link">
            단지의 첫 지갑을 만들어볼까요? <strong>회원가입</strong>
            <img src="@/assets/icons/right-arrow.svg" alt="화살표" class="arrow-icon" />
          </router-link>
        </div>

        <!-- 3) 로그인 버튼 -->
        <button class="login-btn" @click="onLogin">로그인</button>
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import DanjiInput from '@/components/common/form/DanjiInput.vue'
import { Lock, User } from 'lucide-vue-next'

const username = ref('')
const password = ref('')

function onLogin() {
  console.log('로그인 시도:', username.value, password.value)
}
</script>

<style scoped>
.login-page {
  padding: 24px;
  background: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-box {
  text-align: center;
  margin-top: 24px;
  margin-bottom: 32px;
}
.logo {
  height: 60px;
  margin-bottom: 12px;
  margin-left: 50px;
}
.tagline {
  font-size: 14px;
  line-height: 1.6;
  color: #666666;
  margin-top: 30px;
}

.form-card {
  width: 365px;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.signup-link {
  font-size: 13px;
  color: #c7c7c7;
  text-align: right;
  margin-top: 4px;
  margin-bottom: -20px;
  margin-right: 15px;
  margin-left: -10px;
}
.signup-link strong {
  color: #c7c7c7;
  font-weight: normal;
}

/* 로그인 버튼 */
.login-btn {
  width: 100%;
  max-width: 360px;
  margin: 20px 0 0;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  background-color: #60584c;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.input-wrapper {
  height: 64px;
  display: flex;
  align-items: center;
  position: relative;
}

.fake-input-icon {
  position: absolute;
  left: 25px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  pointer-events: none;
  z-index: 1;
  color: #d9d9d9;
}

.form-card ::v-deep(input) {
  height: 56px;
  padding-left: 48px;
  font-size: 15px;
  line-height: 44px;
}

.form-card {
  margin-top: 25px;
}

.arrow-icon {
  height: 12px;
  margin-top: -16px;
  margin-left: 310px;
  color: #c7c7c7;
}
</style>
