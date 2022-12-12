import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Flex, IconButton } from 'native-base'
import { COLOR_PRIMARY_600 } from '../../constants'

export const Right = (props) => {
  const { navigate } = useNavigation()

  return (
    <Flex mr="3" align="center" justify="center" direction="column" {...props}>
      <IconButton
        icon={
          <FontAwesome name="comment-o" size={25} color={COLOR_PRIMARY_600} />
        }
        rounded="full"
        onPress={() => navigate('Chat')}
      />
    </Flex>
  )
}
