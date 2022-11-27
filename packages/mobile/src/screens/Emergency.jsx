import {
  Box,
  Center,
  Column,
  Flex,
  InfoIcon,
  Pressable,
  Row,
  Text,
  WarningIcon,
  Spinner,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toggleSuccessToast } from '../helpers/toasts/toggleSuccessToast'
import { useEmergency } from '../store/emergency/provider'

export const Emergency = () => {
  const {
    actions: { askHelp },
    state: { mutationLoading },
  } = useEmergency()
  const toast = useToast()

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Center>
        <Column space={48}>
          <Box width="90%" bg="info.600" p="2" rounded="sm">
            <Row space={3}>
              <InfoIcon color="white" mt="2" />
              <Text bold color="white">
                Uma notificação será enviada para todos os usuários que
                participam dos mesmos grupos que você.
              </Text>
            </Row>
          </Box>
          <Pressable
            onPress={() =>
              askHelp({ data: 'some data' }, () => {
                toggleSuccessToast(
                  toast,
                  'Solicitação de ajuda enviada com sucesso!'
                )
              })
            }
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
      </Center>
    </SafeAreaView>
  )
}
