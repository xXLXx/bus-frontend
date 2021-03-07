/**
 * Configuration
 */
export default {
  maps: {
    apiKey: process.env.REACT_APP_MAPS_API_KEY,
    defaultCenter: { lat: -34.397, lng: 150.644 },
    defaultZoom: 15
  },
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    apiKey: process.env.REACT_APP_API_KEY
  },
  store: {
    debug: process.env.NODE_ENV === 'development' ? true : false
  }
}
