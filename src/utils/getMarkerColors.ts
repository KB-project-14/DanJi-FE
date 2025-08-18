const COLORS = [
  '#FF3B30',
  '#FF9500',
  '#FFD60A',
  '#34C759',
  '#00C7BE',
  '#007AFF',
  '#5856D6',
  '#AF52DE',
  '#FF2D55',
  '#5AC8FA',
  '#FF9F0A',
  '#BF5AF2',
  '#FF375F',
  '#32D74B',
  '#0A84FF',
]

/**
 * 문자열을 기반으로 색상을 반환합니다.
 * 문자열을 해싱하여 COLORS 배열에서 색상을 선택합니다.
 * @param str - 기준 문자열
 * @returns HEX 색상값
 */
export function getHashColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}
