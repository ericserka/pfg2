import { FontAwesome5 } from '@expo/vector-icons'
import { Button, Center, Row, Text, Column } from 'native-base'
import { Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const NoLocationPermissions = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <Center flex={1} bg="purple.200" px="3">
      <Column space={5}>
        <Column space={3}>
          <Text bold fontSize="xl" color="gray.900">
            Este aplicativo precisa da sua localização exata!
          </Text>
          <Text fontSize="md" color="gray.600">
            Vá em configurações e
          </Text>
          <Column space={2}>
            <Row space={3}>
              <FontAwesome5 name="location-arrow" size={20} color="blue" />
              <Text>Selecione localização</Text>
            </Row>
            <Row space={3}>
              <FontAwesome5 name="check" size={16} color="green" />
              <Text>
                Permitir <Text bold>Sempre</Text> ou{' '}
                <Text bold>Durante o uso do aplicativo </Text>
              </Text>
            </Row>
          </Column>
        </Column>
        <Button p="3" bg="red.500" onPress={Linking.openSettings}>
          <Text fontSize="lg" bold color="white">
            Configurações
          </Text>
        </Button>
      </Column>
    </Center>
  </SafeAreaView>
)
