import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Flex, IconButton } from 'native-base'
import { COLOR_PRIMARY_600 } from '../../constants'

export const Left = (props) => {
  const { navigate } = useNavigation()
  return (
    <Flex ml="3" align="center" justify="center" direction="column" {...props}>
      <IconButton
        onPress={() => navigate('Configurações')}
        rounded="full"
        icon={<FontAwesome name="gear" size={25} color={COLOR_PRIMARY_600} />}
      />
    </Flex>
  )
}
