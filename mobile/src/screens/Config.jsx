import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Pressable,
  StatusBar,
  Text,
} from 'native-base'
import { useState } from 'react'
import { Animated, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SceneMap, TabView } from 'react-native-tab-view'
import { ChangePassword } from '../components/config/ChangePassword'
import { EditData } from '../components/config/EditData'
import { LocationSharing } from '../components/config/LocationSharing'
import { COLOR_GRAY_200, COLOR_PRIMARY_600 } from '../constants'
import { useUserAuth } from '../store/auth/provider'

export const Config = () => {
  const { goBack } = useNavigation()
  const {
    actions: { logout },
  } = useUserAuth()
  const [index, setIndex] = useState(0)
  const routes = [
    {
      key: 'first',
      title: 'Editar dados',
    },
    {
      key: 'second',
      title: 'Alterar senha',
    },
    {
      key: 'third',
      title: 'Compartilhamento de localização',
    },
  ]
  const initialLayout = {
    width: Dimensions.get('window').width,
  }
  const renderScene = SceneMap({
    first: EditData,
    second: ChangePassword,
    third: LocationSharing,
  })

  const renderTabBar = ({ navigationState }) => (
    <Box flexDirection="row">
      {navigationState.routes.map((route, i) => (
        <Box
          key={i}
          borderBottomWidth="3"
          borderColor={index === i ? 'primary.600' : 'coolGray.200'}
          flex={1}
          alignItems="center"
          p="3"
          cursor="pointer"
        >
          <Pressable
            onPress={() => {
              setIndex(i)
            }}
          >
            <Animated.Text
              style={{
                color: index === i ? '#000' : '#1f2937',
              }}
            >
              {route.title}
            </Animated.Text>
          </Pressable>
        </Box>
      ))}
    </Box>
  )

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
        <Button h="80%" onPress={logout} bg="red.600">
          <Text color="white" bold fontSize="xs">
            Sair
          </Text>
        </Button>
      </Flex>
      <TabView
        navigationState={{
          index,
          routes,
        }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={{
          marginTop: StatusBar.currentHeight,
          backgroundColor: COLOR_GRAY_200,
        }}
      />
    </SafeAreaView>
  )
}
