import { FontAwesome } from '@expo/vector-icons'
import { Center, Column, Row, Text } from 'native-base'
import { Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLOR_PRIMARY_600, COLOR_SUCCESS_600 } from '../constants'
import { CustomButton } from './buttons/CustomButton'

export const NoLocationPermissions = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <Center flex={1} px="3">
      <Column space={5}>
        <Column space={3}>
          <Text bold fontSize="xl">
            Este aplicativo precisa da sua localização exata mesmo em segundo
            plano!
          </Text>
          <Text fontSize="md">Vá em configurações e</Text>
          <Column space={2}>
            <Row space={3}>
              <FontAwesome
                name="location-arrow"
                size={20}
                color={COLOR_PRIMARY_600}
              />
              <Text>Selecione localização</Text>
            </Row>
            <Row space={3}>
              <FontAwesome name="check" size={16} color={COLOR_SUCCESS_600} />
              <Text>
                Permitir <Text bold>Sempre</Text>
              </Text>
            </Row>
          </Column>
        </Column>
        <CustomButton title="Configurações" onPress={Linking.openSettings} />
      </Column>
    </Center>
  </SafeAreaView>
)
