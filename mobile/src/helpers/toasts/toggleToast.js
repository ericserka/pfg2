import { Box, Text, Row } from 'native-base'
import { AlertIcon } from '../../components/alert/AlertIcon'

export const toggleToast = (toast, message, type) => {
  toast.show({
    render: () => (
      <Box bg={`${type}.600`} p="2" rounded="sm" mt="10">
        <Row justifyContent="space-between" space={3}>
          <AlertIcon type={type} />
          <Text bold color="white">
            {message}
          </Text>
        </Row>
      </Box>
    ),
    placement: 'top',
  })
}
