import { SafeAreaView } from 'react-native-safe-area-context'
import { Map } from '../components/Map'

export const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <Map />
    </SafeAreaView>
  )
}
