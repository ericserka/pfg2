import { Button, StatusBar, Text } from 'native-base'
import { useState } from 'react'
import { Dimensions } from 'react-native'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import { ChangePassword } from '../components/config/ChangePassword'
import { EditData } from '../components/config/EditData'
import { GroupsList } from '../components/config/GroupsList'
import { LocationSharing } from '../components/config/LocationSharing'
import { ScreenHeader } from '../components/ScreenHeader'
import { COLOR_GRAY_200, COLOR_PRIMARY_600 } from '../constants'
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

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: COLOR_PRIMARY_600 }}
      activeColor={COLOR_PRIMARY_600}
      inactiveColor="#1f2937"
      style={{ backgroundColor: 'transparent' }}
      tabStyle={{ padding: 5 }}
      labelStyle={{
        fontSize: 14,
        textAlign: 'center',
        textTransform: 'none',
      }}
    />
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
