import type { FaqItem } from '../model/types'

export const getFaqItemId = (item: FaqItem) => ('id' in item ? item.id : item.fakeId)
