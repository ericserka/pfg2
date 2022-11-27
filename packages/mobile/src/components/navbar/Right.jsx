import { FontAwesome5 } from '@expo/vector-icons'
import { Flex, IconButton } from 'native-base'
import { COLOR_ERROR_600 } from '../../constants'
import { useUserAuth } from '../../store/auth/provider'

export const Right = (props) => {
  const {
    actions: { logout },
  } = useUserAuth()

  return (
    <Flex mr="3" align="center" justify="center" direction="column" {...props}>
      <IconButton
        icon={
          <FontAwesome5 name="sign-out-alt" size={25} color={COLOR_ERROR_600} />
        }
        rounded="full"
        onPress={logout}
      />
    </Flex>
  )
}
