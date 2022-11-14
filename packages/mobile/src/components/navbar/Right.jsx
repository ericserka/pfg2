import { FontAwesome5 } from '@expo/vector-icons'
import { Flex, IconButton } from 'native-base'
import { useUserAuth } from '../../store/auth/provider'

export const Right = (props) => {
  const {
    authActions: { logout },
  } = useUserAuth()

  return (
    <Flex mr="3" align="center" justify="center" direction="column" {...props}>
      <IconButton
        icon={<FontAwesome5 name="sign-out-alt" size={25} color="#ff5500" />}
        rounded="full"
        onPress={logout}
      />
    </Flex>
  )
}
