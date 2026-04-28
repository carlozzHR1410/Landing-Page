const NEIGHBOR_KEY = 'serv_alert_neighbor_token'

const getStoredToken = () => {
  const token = localStorage.getItem(NEIGHBOR_KEY)
  if (token) return token
  const nextToken = crypto.randomUUID()
  localStorage.setItem(NEIGHBOR_KEY, nextToken)
  return nextToken
}

export const createValidationSlice = (set) => ({
  neighborToken: getStoredToken(),
  confirmationsByToken: {},
  markConfirmation: (token, reportId) =>
    set((state) => ({
      confirmationsByToken: {
        ...state.confirmationsByToken,
        [token]: [...(state.confirmationsByToken[token] || []), reportId],
      },
    })),
  hasConfirmed: (token, reportId) => {
    const list = JSON.parse(localStorage.getItem(`confirmed_${token}`) || '[]')
    return list.includes(reportId)
  },
  persistConfirmedReport: (token, reportId) => {
    const key = `confirmed_${token}`
    const list = JSON.parse(localStorage.getItem(key) || '[]')
    if (!list.includes(reportId)) {
      localStorage.setItem(key, JSON.stringify([...list, reportId]))
    }
  },
})
