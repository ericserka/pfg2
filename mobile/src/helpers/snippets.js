export const removeSpecialCharacters = (str) => str.replace(/[^a-zA-Z0-9]/g, '')

export const generateGoogleMapsRouteLink = (lat, long) =>
  `https://www.google.com/maps/dir/?api=1&dir_action=navigate&destination=${lat},${long}`

export const generateWazeRouteLink = (lat, long) =>
  `https://www.waze.com/ul?ll=${lat}%2C${long}&navigate=yes`

export const updateAllValuesFromObj = (obj, value) =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key] = value
    return acc
  }, {})

export const maskPhoneNumber = (phoneNumber) =>
  `+${phoneNumber.substring(0, 2)} (${phoneNumber.substring(
    2,
    4
  )}) ${phoneNumber.substring(4, 9)}-${phoneNumber.substring(9, 13)}`

export const generateRandomPassword = () => Math.random().toString(36).slice(-8)

export const countElementInArray = (arr, el) =>
  arr.reduce((acc, value) => {
    return value === el ? acc + 1 : acc
  }, 0)

export const countValueInObject = (obj, value) =>
  countElementInArray(Object.values(obj), value)

export const isObjectEmpty = (obj) =>
  obj &&
  Object.keys(obj).length === 0 &&
  Object.getPrototypeOf(obj) === Object.prototype
