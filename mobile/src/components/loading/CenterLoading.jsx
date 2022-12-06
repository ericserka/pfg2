import { Center, Spinner } from 'native-base'

export const CenterLoading = () => {
  return (
    <Center flex={1}>
      <Spinner size="lg" />
    </Center>
  )
}
