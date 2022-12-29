import { FontAwesome } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import {
  Box,
  Center,
  FlatList,
  Flex,
  IconButton,
  KeyboardAvoidingView,
  Text,
  TextArea,
  VStack,
} from 'native-base'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard } from 'react-native'
import ImageModal from 'react-native-image-modal'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLOR_PRIMARY_600 } from '../constants'
import { scrollToBottom } from '../helpers/actions/scrollToBottom'
import { dayjs } from '../helpers/dayjs'
import { log } from '../helpers/logger'
import { useUserAuth } from '../store/auth/provider'
import { useUserGroup } from '../store/groups/provider'
import { useWebSocket } from '../store/websocket/provider'

export const Chat = () => {
  const { goBack } = useNavigation()
  const messageListRef = useRef(null)
  const [text, setText] = useState('')
  const [inputPb, setInputPb] = useState(undefined)

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

  useFocusEffect(
    useCallback(() => {
      if (!current?.messages?.length) return
      scrollToBottom(messageListRef)
    }, [])
  )

  useEffect(() => {
    const last = current?.messages?.slice(-1)?.[0]
    if (last?.senderId === session.id) {
      scrollToBottom(messageListRef, 0)
    }
  }, [current?.messages])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setInputPb('12')
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setInputPb(undefined)
      }
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  const handleEmitMessage = (content) => {
    const message = {
      content,
      userId: session.id,
      groupId: current?.id,
    }

    emitEventSendMessage(message, (_, returned) => {
      log.info(`[${session.username}] sent message event`, {
        ...returned,
        sender: session.username,
      })
      receiveChatMessage(returned)
    })
  }

  const handleSendTextMessage = () => {
    const sanitezedText = text.trim()
    if (!sanitezedText) return

    handleEmitMessage(sanitezedText)

    setText('')
  }

  const handleSendImageMessage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    })

    if (!result.canceled) {
      handleEmitMessage(`data:image/jpeg;base64,${result.assets[0].base64}`)
    }
  }

  const renderItem = ({ item, index }) => {
    const currentMessageDate = dayjs(item.createdAt)
    const isDifferentDay = !dayjs(currentMessageDate).isSame(
      dayjs(current?.messages?.[index - 1]?.createdAt),
      'day'
    )
    return (
      <>
        {(!index || isDifferentDay) && (
          <Box my="3" p="3" rounded="xl" bg="white" alignSelf="center">
            {currentMessageDate.format('DD/MM/YYYY')}
          </Box>
        )}
        <VStack
          my="1"
          p="3"
          space="1"
          rounded="lg"
          bg={item.sender.id === session.id ? 'blue.300' : 'white'}
          alignSelf={session.id === item.sender.id ? 'flex-end' : 'flex-start'}
        >
          <Text bold fontSize="md" underline>
            {item.sender.username}
          </Text>
          <Flex direction="row" justify="space-between" align="center">
            {item.content.startsWith('data:image/jpeg;base64,') ? (
              <ImageModal
                resizeMode="contain"
                style={{
                  width: 250,
                  height: 250,
                  borderRadius: 5,
                }}
                source={{
                  uri: item.content,
                }}
                alt={`imagem enviada por ${item.sender.username}`}
              />
            ) : (
              <Text textAlign="justify" maxW="2xs" fontSize="sm">
                {item.content}
              </Text>
            )}
            <Text
              mt="2"
              ml="2"
              fontSize={10}
              color="gray.500"
              alignSelf="flex-end"
            >
              {currentMessageDate.format('HH:mm')}
            </Text>
          </Flex>
        </VStack>
      </>
    )
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
        pb={inputPb}
      >
        <Flex
          px="3"
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
        </Flex>
        <FlatList
          bg="gray.200"
          ref={messageListRef}
          px="3"
          data={current?.messages}
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
          renderItem={renderItem}
        />
        {current?.messages && (
          <IconButton
            position="absolute"
            bottom="24"
            right="5"
            rounded="full"
            bg={COLOR_PRIMARY_600}
            icon={<FontAwesome name="arrow-down" size={25} color="white" />}
            onPress={() => scrollToBottom(messageListRef, 0)}
          />
        )}
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
                icon={
                  <FontAwesome
                    name="file-image-o"
                    size={20}
                    color={COLOR_PRIMARY_600}
                  />
                }
                onPress={handleSendImageMessage}
              />
            }
            rightElement={
              <IconButton
                onPress={handleSendTextMessage}
                icon={
                  <FontAwesome
                    name="paper-plane"
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
