export const removeSpecialCharacters = (str) => str.replace(/[^a-zA-Z0-9]/g, '')

export const generateGoogleMapsRouteLink = (lat, long) =>
  `https://www.google.com/maps/dir/?api=1&dir_action=navigate&destination=${lat},${long}`

export const generateWazeRouteLink = (lat, long) =>
  `https://www.waze.com/ul?ll=${lat}%2C${long}&navigate=yes`
