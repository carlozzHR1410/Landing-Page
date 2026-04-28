import { useEffect } from 'react'
import { useStore } from '../../store/useStore'

export const useMap = () => {
  const departments = useStore((state) => state.departments)
  const mapLoading = useStore((state) => state.mapLoading)
  const mapError = useStore((state) => state.mapError)
  const loadDepartments = useStore((state) => state.loadDepartments)

  useEffect(() => {
    if (departments.length === 0) {
      loadDepartments()
    }
  }, [departments.length, loadDepartments])

  return { departments, mapLoading, mapError }
}
