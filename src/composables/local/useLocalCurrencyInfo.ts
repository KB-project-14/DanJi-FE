import { computed, type Ref } from 'vue'
import useGetLocalCurrencies from '@/composables/queries/local/useGetLocalCurrencies'
import type { LocalcurrencyListRequestDTO } from '@/types/local/localTypes'
import { benefitTypeTextMap } from '@/constants/BenefitMapper'

export default function useLocalCurrencyInfo(
  requestQuery: Ref<Partial<LocalcurrencyListRequestDTO>>,
) {
  const localCurrencyQuery = computed<LocalcurrencyListRequestDTO>(() => ({
    benefitType: requestQuery.value.benefitType || null,
    city: requestQuery.value.city || null,
    localCurrencyId: requestQuery.value.localCurrencyId || null,
    province: requestQuery.value.province || null,
    regionId: requestQuery.value.regionId || null,
  }))

  const localCurrencies = useGetLocalCurrencies(localCurrencyQuery)

  const primaryLocalCurrency = computed(() => {
    if (!localCurrencies.value || localCurrencies.value.length === 0) return null
    return localCurrencies.value[0]
  })

  const localCurrencyName = computed(() => primaryLocalCurrency.value?.name || '')

  const localCurrencyId = computed(() => primaryLocalCurrency.value?.localCurrencyId || '')

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
