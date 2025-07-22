import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DanjiButton from '@/components/common/button/DanjiButton.vue'

describe('DanjiButton 컴포넌트', () => {
  describe('기본 렌더링', () => {
    test('슬롯 텍스트가 올바르게 렌더링된다', () => {
      const wrapper = mount(DanjiButton, {
        slots: {
          default: '저장하기',
        },
      })

      expect(wrapper.text()).toBe('저장하기')
    })

    test('button 엘리먼트가 렌더링된다', () => {
      const wrapper = mount(DanjiButton, {
        slots: {
          default: '테스트',
        },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    test('기본 클래스들이 적용된다', () => {
      const wrapper = mount(DanjiButton, {
        slots: {
          default: '테스트',
        },
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('inline-flex')
      expect(button.classes()).toContain('items-center')
      expect(button.classes()).toContain('justify-center')
    })
  })

  describe('접근성 테스트', () => {
    test('button 역할이 올바르게 설정된다', () => {
      const wrapper = mount(DanjiButton, {
        slots: {
          default: '접근성 테스트',
        },
      })

      const button = wrapper.find('button')
      expect(button.element.tagName).toBe('BUTTON')
    })
  })
})
