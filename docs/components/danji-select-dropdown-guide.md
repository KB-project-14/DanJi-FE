# DanjiDropdownOptions

`DanjiSelect`와 같은 셀렉트 컴포넌트의 드롭다운 옵션 영역을 **별도 분리한 컴포넌트**입니다.  
`options` 배열을 받아 옵션 목록을 렌더링하며, 클릭 시 `select` 이벤트로 상위 컴포넌트에 선택 값을 전달합니다.

`absolute`, `rounded`, `hover:bg` 등의 Tailwind 클래스를 사용하여  
스타일링 및 사용자 상호작용 효과를 제공합니다.

---

## ✅ Props

| 이름         | 타입       | 설명                                      |
| ------------ | ---------- | ----------------------------------------- |
| `modelValue` | `string`   | 현재 선택된 옵션 문자열입니다.            |
| `options`    | `string[]` | 드롭다운에 표시할 옵션 문자열 배열입니다. |

---

## 📤 Emits

| 이벤트 이름 | 설명                                                                         |
| ----------- | ---------------------------------------------------------------------------- |
| `select`    | 옵션 클릭 시 발생. 선택된 옵션 문자열을 인자로 전달합니다. `(value: string)` |

---

## 🧪 예제: 기본 사용법

```vue
<danji-dropdown-options
  :model-value="selectedOption"
  :options="['서울', '부산', '대전']"
  @select="handleSelect"
/>
```
