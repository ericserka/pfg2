export const scrollToTop = (ref, timeInterval = 250) => {
  setTimeout(() => {
    ref?.current?.scrollToOffset({ animated: true, offset: 0 })
  }, timeInterval)
}
