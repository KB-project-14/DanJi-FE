import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DanjiButton from '@/components/common/button/DanjiButton.vue'

describe('DanjiButton', () => {
  test('기본 슬롯 텍스트가 잘 렌더링되어야 한다', () => {
    const wrapper = mount(DanjiButton, {
      slots: {
        default: '저장하기',
      },
    })
    expect(wrapper.text()).toBe('저장하기')
  })

  test('variant에 따라 클래스가 올바르게 적용되어야 한다', () => {
    const wrapper = mount(DanjiButton, {
      props: {
        variant: 'large',
      },
      slots: {
        default: '확인',
      },
    })
    expect(wrapper.classes()).toContain('btn-danji-large')
    expect(wrapper.classes()).toContain('Head02')
  })

  test('클릭 이벤트가 정상적으로 발생해야 한다', async () => {
    const clickSpy = vi.fn()

    const wrapper = mount(DanjiButton, {
      props: {
        onClick: clickSpy,
      },
      slots: {
        default: '클릭',
      },
    })

    await wrapper.trigger('click')
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  test('disabled가 true일 때 버튼이 비활성화되어야 한다', () => {
    const wrapper = mount(DanjiButton, {
      props: {
        disabled: true,
      },
      slots: {
        default: '비활성화',
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  test('variant를 설정하지 않으면 기본값 medium이 적용되어야 한다', () => {
    const wrapper = mount(DanjiButton, {
      slots: {
        default: '기본',
      },
    })

    expect(wrapper.classes()).toContain('btn-danji-medium')
    expect(wrapper.classes()).toContain('Head02')
  })
})
