import api from './api'

const mockDepartments = [
  {
    id: crypto.randomUUID(),
    name: 'San Miguel',
    code: 'SM',
    status: 'critical',
    active_reports: 27,
    updated_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Usulután',
    code: 'US',
    status: 'warning',
    active_reports: 14,
    updated_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Morazán',
    code: 'MO',
    status: 'normal',
    active_reports: 6,
    updated_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'La Unión',
    code: 'LU',
    status: 'warning',
    active_reports: 11,
    updated_at: new Date().toISOString(),
  },
]

const shouldUseMock = true

const simulateDelay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 250))

export const getDepartmentStatus = async () => {
  if (!shouldUseMock) {
    const { data } = await api.get('/departments/status')
    return data
  }

  return simulateDelay(mockDepartments)
}
