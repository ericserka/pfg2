export const removeSpecialCharacters = (str) => str.replace(/[^a-zA-Z0-9]/g, '')

export const generateGoogleMapsRouteLink = (lat, long) =>
  `https://www.google.com/maps/dir/?api=1&dir_action=navigate&destination=${lat},${long}`

export const generateWazeRouteLink = (lat, long) =>
  `https://www.waze.com/ul?ll=${lat}%2C${long}&navigate=yes`

export const countKeyValueFromArrOfObjs = (arrOfObjs, key) =>
  arrOfObjs.reduce((result, obj) => {
    result[obj[key]] = (result[obj[key]] || 0) + 1
    return result
  }, {})

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
