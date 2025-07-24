# LocalFilterModal

도/시 단위의 지역을 선택할 수 있는 **하단 슬라이드형 모달 컴포넌트**입니다.  
외부에서 `isVisible`로 모달 표시 여부를 제어하고, 선택된 지역 정보를 `confirm` 이벤트로 전달합니다.

`DanjiChipGroup`을 활용해 도/시를 각각 탭 형태로 선택할 수 있으며,  
모달 외부를 클릭하면 `close` 이벤트가 발생하여 닫히도록 설계되어 있습니다.

---

## ✅ Props

| 이름           | 타입      | 설명                                                         |
| -------------- | --------- | ------------------------------------------------------------ |
| `isVisible`    | `boolean` | 모달 표시 여부 (`true`이면 나타나고, `false`이면 숨겨집니다) |
| `initalRegion` | `string`  | 초기 선택 도 이름 (예: `'강원도'`)                           |
| `initialCity`  | `string`  | 초기 선택 시 이름 (예: `'춘천시'`)                           |

---

## 📤 Emits

| 이벤트 이름 | 설명                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------ |
| `close`     | 모달 외부 클릭 시 발생하며, 모달을 닫기 위한 이벤트입니다.                                 |
| `confirm`   | "확인" 버튼 클릭 시 발생하며, `(region: string, city: string)` 형식의 데이터를 전달합니다. |

---

## 🧪 예제: 기본 사용법

```vue
<region-select-modal
  :is-visible="isModalOpen"
  :inital-region="'강원도'"
  :initial-city="'춘천시'"
  @close="isModalOpen = false"
  @confirm="handleRegionConfirm"
/>
```
