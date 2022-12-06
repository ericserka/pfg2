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
import { SafeAreaView } from 'react-native-safe-area-context'
import { MessageBox } from '../components/MessageBox'
import { toggleToast } from '../helpers/toasts/toggleToast'
import { useUserAuth } from '../store/auth/provider'
import { useEmergency } from '../store/emergency/provider'
import { useUserGroup } from '../store/groups/provider'
import { useWebSocket } from '../store/websocket/provider'

export const Emergency = () => {
  const {
    actions: { askHelp },
    state: { mutationLoading },
  } = useEmergency()
  const toast = useToast()
  const {
    actions: { emitEventRemoveGroupMember },
  } = useWebSocket()
  const {
    state: { userGroupsAmount },
  } = useUserGroup()
  const {
    state: { session },
  } = useUserAuth()

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
                askHelp(`${session.username} solicitou ajuda.`, () => {
                  toggleToast(
                    toast,
                    'Solicitação de ajuda enviada com sucesso!',
                    'success'
                  )
                })
              }}
              isDisabled={mutationLoading}
            >
              <Box
                borderRadius="full"
                borderColor="red.600"
                borderWidth="4"
                width="100%"
                height={80}
                bg="red.50"
              >
                {mutationLoading ? (
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
