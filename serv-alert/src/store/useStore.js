import { create } from 'zustand'
import { createMapSlice } from '../features/map/mapSlice'
import { createReportsSlice } from '../features/reports/reportsSlice'
import { createValidationSlice } from '../features/validation/validationSlice'

export const useStore = create((...args) => ({
  ...createReportsSlice(...args),
  ...createMapSlice(...args),
  ...createValidationSlice(...args),
}))
