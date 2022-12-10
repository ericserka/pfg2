import {
  Box,
  Center,
  Column,
  Flex,
  Pressable,
  Spinner,
  Text,
  useToast,
  View,
  WarningIcon,
} from 'native-base'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MessageBox } from '../components/MessageBox'
import { handleSocketResponse } from '../helpers/feedback/handleSocketResponse'
import { useUserAuth } from '../store/auth/provider'
import { useUserGroup } from '../store/groups/provider'
import { useWebSocket } from '../store/websocket/provider'

export const Emergency = () => {
  const toast = useToast()
  const {
    actions: { emitEventAskHelp },
  } = useWebSocket()
  const {
    state: { userGroupsAmount },
  } = useUserGroup()
  const {
    state: { session },
  } = useUserAuth()

  const [loading, setLoading] = useState(false)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Center>
        {userGroupsAmount === 0 ? (
          <View mt="75%">
            <MessageBox
              type="info"
              content="Antes de pedir por ajuda, é necessário participar de pelo menos um grupo."
              mt="2"
            />
          </View>
        ) : (
          <Column space={48}>
            <MessageBox
              type="info"
              content="Uma notificação será enviada para todos os usuários que participam dos
          mesmos grupos que você."
              mt="2"
            />
            <Pressable
              onPress={() => {
                setLoading(true)
                emitEventAskHelp(
                  {
                    user: { id: session.id, username: session.username },
                  },
                  (response) => {
                    setLoading(false)
                    handleSocketResponse(response, toast)
                  }
                )
              }}
              isDisabled={loading}
            >
              <Box
                borderRadius="full"
                borderColor="red.600"
                borderWidth="4"
                width="100%"
                height={80}
                bg="red.50"
              >
                {loading ? (
                  <Spinner color="red.600" size={96} mt={24} />
                ) : (
                  <Flex align="center" justify="center" direction="column">
                    <WarningIcon size={24} color="red.600" mt={12} />
                    <Text fontSize="3xl" bold color="red.600" mt={12}>
                      SOLICITAR AJUDA!
                    </Text>
                  </Flex>
                )}
              </Box>
            </Pressable>
          </Column>
        )}
      </Center>
    </SafeAreaView>
  )
}
