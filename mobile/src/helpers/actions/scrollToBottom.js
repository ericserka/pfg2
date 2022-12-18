export const scrollToBottom = (ref, timeInterval = 250) => {
  setTimeout(() => {
    ref?.current?.scrollToEnd({ animated: true })
  }, timeInterval)
}
