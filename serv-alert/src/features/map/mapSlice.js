import { getDepartmentStatus } from '../../services/mapService'

export const createMapSlice = (set) => ({
  departments: [],
  mapLoading: false,
  mapError: null,
  loadDepartments: async () => {
    set({ mapLoading: true, mapError: null })
    try {
      const data = await getDepartmentStatus()
      set({ departments: data, mapLoading: false })
    } catch {
      set({
        mapLoading: false,
        mapError: 'No se pudo cargar el mapa de calor.',
      })
    }
  },
})
