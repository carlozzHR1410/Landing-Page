import { useEffect, useState } from 'react'

export const useGeoLocation = () => {
  const geolocationAvailable = Boolean(navigator.geolocation)
  const [state, setState] = useState({
    loading: geolocationAvailable,
    error: geolocationAvailable ? null : 'Geolocalizacion no disponible.',
    coords: null,
  })

  useEffect(() => {
    if (!geolocationAvailable) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setState({
          loading: false,
          error: null,
          coords: { lat: coords.latitude, lng: coords.longitude },
        }),
      () =>
        setState({
          loading: false,
          error: 'No se pudo obtener tu ubicacion.',
          coords: null,
        }),
      { enableHighAccuracy: false, timeout: 6000 },
    )
  }, [geolocationAvailable])

  return state
}
