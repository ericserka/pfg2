import { Box, Button, Pressable, StatusBar, Text } from 'native-base'
import { useState } from 'react'
import { Animated, Dimensions } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'
import { ChangePassword } from '../components/config/ChangePassword'
import { EditData } from '../components/config/EditData'
import { GroupsList } from '../components/config/GroupsList'
import { LocationSharing } from '../components/config/LocationSharing'
import { ScreenHeader } from '../components/ScreenHeader'
import { COLOR_GRAY_200 } from '../constants'
import { useUserAuth } from '../store/auth/provider'

export const Config = ({ route }) => {
  const {
    actions: { logout },
  } = useUserAuth()
  const [index, setIndex] = useState(route?.params?.tabIndex ?? 0)
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
    {
      key: 'fourth',
      title: 'Grupos',
    },
  ]
  const initialLayout = {
    width: Dimensions.get('window').width,
  }
  const renderScene = SceneMap({
    first: EditData,
    second: ChangePassword,
    third: LocationSharing,
    fourth: GroupsList,
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
    <ScreenHeader
      right={
        <Button h="80%" onPress={logout} bg="red.600">
          <Text color="white" bold fontSize="xs">
            Sair
          </Text>
        </Button>
      }
    >
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
    </ScreenHeader>
  )
}
