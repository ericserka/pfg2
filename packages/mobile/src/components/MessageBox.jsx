import { Box, Row, Text } from 'native-base'
import { AlertIcon } from './alert/AlertIcon'

export const MessageBox = ({ type, content, ...rest }) => {
  return (
    <Box width="90%" bg={`${type}.600`} p="2" rounded="sm">
      <Row justifyContent="space-between" space={3}>
        <AlertIcon type={type} {...rest} />
        <Text width="90%" bold color="white">
          {content}
        </Text>
      </Row>
    </Box>
  )
}
