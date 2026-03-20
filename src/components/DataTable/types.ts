import type { Dayjs } from 'dayjs'

export interface DataRecord {
  id: string
  name: string
  date: string
  amount: number
}

export interface RecordFormValues {
  name: string
  date: Dayjs
  amount: number
}
