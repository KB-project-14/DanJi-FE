import { computed, type Ref } from 'vue'
import useGetLocalCurrencies from '@/composables/queries/local/useGetLocalCurrencies'
import type { localcurrencyListRequestDtoType } from '@/types/local/localTypes'
import { benefitTypeTextMap } from '@/utils/benefit'

export default function useLocalCurrencyInfo(
  requestQuery: Ref<Partial<localcurrencyListRequestDtoType>>,
) {
  const localCurrencyQuery = computed<localcurrencyListRequestDtoType>(() => ({
    benefitType: requestQuery.value.benefitType || null,
    city: requestQuery.value.city || null,
    localCurrencyId: requestQuery.value.localCurrencyId || null,
    province: requestQuery.value.province || null,
    regionId: requestQuery.value.regionId || null,
  }))

  const localCurrencies = useGetLocalCurrencies(localCurrencyQuery)

  // 첫 번째 지역화폐 정보
  const primaryLocalCurrency = computed(() => {
    if (!localCurrencies.value || localCurrencies.value.length === 0) return null
    return localCurrencies.value[0]
  })

  // 지역화폐 이름
  const localCurrencyName = computed(() => primaryLocalCurrency.value?.name || '')

  // 지역화폐 id
  const localCurrencyId = computed(() => primaryLocalCurrency.value?.localCurrencyId || '')

  // 혜택 정보 (타입, 퍼센테이지, 최대 충전 가능 금액)
  const benefitInfo = computed(() => {
    const currency = primaryLocalCurrency.value
    if (!currency) return null

    return {
      type: currency.benefitType,
      percentage: currency.percentage,
      maximum: currency.maximum,
      img: currency.imageUrl,
    }
  })

  // 혜택 정보 텍스트
  const benefitDescription = computed(() => {
    const benefit = benefitInfo.value
    if (!benefit) return ''

    const typeText = benefitTypeTextMap[benefit.type]

    return `${localCurrencyName.value} ${typeText} ${benefitInfo.value.percentage}%`
  })

  return {
    localCurrencies,
    localCurrencyName,
    localCurrencyId,
    benefitInfo,
    benefitDescription,
  }
}
