import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import {
  Center,
  FlatList,
  Flex,
  HStack,
  IconButton,
  KeyboardAvoidingView,
  Text,
  TextArea,
  VStack,
} from 'native-base'
import { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLOR_PRIMARY_600 } from '../constants'
import { dayjs } from '../helpers/dayjs'
import { log } from '../helpers/logger'
import { useUserAuth } from '../store/auth/provider'
import { useUserGroup } from '../store/groups/provider'
import { useWebSocket } from '../store/websocket/provider'

export const Chat = () => {
  const { goBack } = useNavigation()
  const messageListRef = useRef(null)
  const [text, setText] = useState('')

  const {
    state: { current },
    actions: { receiveChatMessage },
  } = useUserGroup()
  const {
    state: { session },
  } = useUserAuth()
  const {
    actions: { emitEventSendMessage },
  } = useWebSocket()

  const canSendMessage = current?.members?.length

  useEffect(() => {
    if (!current.messages?.length) return

    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    setTimeout(() => {
      messageListRef?.current.scrollToEnd({ animated: true })
    }, 500)
  }

  const handleSend = () => {
    const sanitezedText = text.trim()
    if (!sanitezedText) return

    const message = {
      content: sanitezedText,
      userId: session.id,
      groupId: current.id,
    }

    emitEventSendMessage(message, (_, returned) => {
      log.info(`[${session.username}] sent message event`, returned)
      receiveChatMessage(returned)
    })

    setText('')

    scrollToBottom()
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        flex={1}
        h={{
          base: '400px',
          lg: 'auto',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
          <IconButton
            onPress={() => {
              // navigate to details
            }}
            rounded="full"
            icon={
              <FontAwesome name="info" size={25} color={COLOR_PRIMARY_600} />
            }
          />
        </Flex>
        <FlatList
          bg="gray.200"
          ref={messageListRef}
          px="3"
          data={current.messages}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <Center px="3" mt="50%">
              <Text fontSize={20} textAlign="center" fontWeight="semibold">
                {canSendMessage
                  ? 'Nenhuma mensagem enviada ainda 🥹'
                  : 'Você está sozinho 😕. Convide alguém para conversar!'}
              </Text>
            </Center>
          )}
          renderItem={({ item }) => (
            <VStack
              my="1"
              p="3"
              space="1"
              rounded="lg"
              bg={item.sender.id === session.id ? 'green.400' : 'white'}
              alignSelf={
                session.id === item.sender.id ? 'flex-end' : 'flex-start'
              }
            >
              <Text bold fontSize="lg" underline>
                {item.sender.name}
              </Text>
              <HStack space="3">
                <Text textAlign="justify" maxW="2xs">
                  {item.content}
                </Text>
                <Text
                  mt="2"
                  alignSelf="flex-end"
                  fontSize={10}
                  color="gray.500"
                >
                  {dayjs(item.createdAt).format('hh:mm')}
                </Text>
              </HStack>
            </VStack>
          )}
        />
        <Flex
          direction="row"
          justify="space-evenly"
          align="center"
          px="3"
          py="2"
          bg="white"
        >
          <TextArea
            isDisabled={!canSendMessage}
            value={text}
            onChangeText={setText}
            w="95%"
            h="100%"
            placeholder="Mensagem"
            leftElement={
              <IconButton
                rounded="full"
                icon={
                  <FontAwesome
                    name="file-image-o"
                    size={20}
                    color={COLOR_PRIMARY_600}
                  />
                }
              />
            }
            rightElement={
              <IconButton
                onPress={handleSend}
                rounded="full"
                icon={
                  <FontAwesome
                    name="long-arrow-right"
                    size={20}
                    color={COLOR_PRIMARY_600}
                  />
                }
              />
            }
          />
        </Flex>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
