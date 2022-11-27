import { Box, Text } from 'native-base'

export const toggleSuccessToast = (toast, message) => {
  toast.show({
    render: () => (
      <Box bg="emerald.500" p="2" rounded="sm" mt="10">
        <Text bold color="white">
          {message}
        </Text>
      </Box>
    ),
    placement: 'top',
  })
}
