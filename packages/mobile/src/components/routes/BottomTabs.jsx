import { FontAwesome5 } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Notifications } from '../../screens/Notifications'
import { Emergency } from '../../screens/Emergency'
import { LoadingInterceptor } from '../loading/LoadingInterceptor'
import { Left } from '../navbar/Left'
import { Right } from '../navbar/Right'
import { HomeStack } from './HomeStack'
import { useEffect } from 'react'
import { useNotifications } from '../../store/notifications/provider'
import { useUserAuth } from '../../store/auth/provider'

const Tab = createBottomTabNavigator()

export const BottomTabs = () => {
  const {
    state: { queryLoading },
  } = useUserAuth()
  const {
    state: { non_read_notifications_amount },
    actions: { getNonReadNotificationsAmount },
  } = useNotifications()

  useEffect(() => {
    getNonReadNotificationsAmount()
  }, [])
  return (
    <LoadingInterceptor loading={queryLoading}>
      <Tab.Navigator
        screenOptions={{
          headerLeft: (props) => <Left {...props} />,
          headerRight: (props) => <Right {...props} />,
          headerShadowVisible: true,
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            headerTransparent: true,
            tabBarIcon: (props) => <FontAwesome5 name="map" {...props} />,
          }}
          component={HomeStack}
        />
        <Tab.Screen
          name="Emergência"
          options={{
            tabBarIcon: (props) => (
              <FontAwesome5 name="exclamation-circle" {...props} />
            ),
          }}
          component={Emergency}
        />
        <Tab.Screen
          name="Notificações"
          options={{
            tabBarIcon: (props) => <FontAwesome5 name="bell" {...props} />,
            tabBarBadge: non_read_notifications_amount,
          }}
          component={Notifications}
        />
      </Tab.Navigator>
    </LoadingInterceptor>
  )
}
