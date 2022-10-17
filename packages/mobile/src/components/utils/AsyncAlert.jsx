import { Alert } from 'react-native'

const defaultButtons = (resolve, _reject) => [
  {
    text: 'OK',
    onPress: () => {
      resolve()
    },
  },
]

export const AsyncAlert = (title, msg, getButtons = defaultButtons) =>
  new Promise((resolve, reject) => {
    Alert.alert(title, msg, getButtons(resolve, reject), {
      cancelable: false,
    })
  })

export default AsyncAlert
