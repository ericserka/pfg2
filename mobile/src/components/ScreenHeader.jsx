import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Flex, IconButton } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLOR_PRIMARY_600 } from '../constants'

export const ScreenHeader = ({ children, right }) => {
  const { goBack } = useNavigation()
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <Flex
        px="2"
        mt="12"
        direction="row"
        justify="space-between"
        align="center"
      >
        <IconButton
          onPress={() => goBack()}
          rounded="full"
          icon={
            <FontAwesome
              name="arrow-left"
              size={25}
              color={COLOR_PRIMARY_600}
            />
          }
        />
        {right}
      </Flex>
      {children}
    </SafeAreaView>
  )
}
