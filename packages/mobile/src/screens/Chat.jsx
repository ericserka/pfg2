import { FontAwesome5 } from '@expo/vector-icons'
import dayjs from '@pfg2/dayjs'
import { useNavigation } from '@react-navigation/native'
import {
  Center,
  CheckIcon,
  FlatList,
  Flex,
  FormControl,
  HStack,
  IconButton,
  KeyboardAvoidingView,
  Select,
  Text,
  TextArea,
  VStack,
} from 'native-base'
import { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLOR_PRIMARY_600 } from '../constants'
import { useUserAuth } from '../store/auth/provider'
import { useUserGroup } from '../store/groups/provider'
import { useWebSocket } from '../store/websocket/provider'

export const Chat = () => {
  const { goBack } = useNavigation()
  const messageListRef = useRef(null)

  const {
    state: { current, groups },
    actions: { updateCurrentGroup },
  } = useUserGroup()
  const {
    state: { session },
  } = useUserAuth()
  const {
    actions: { emitEventSendMessage, listenToMessageAdded },
  } = useWebSocket()

  const [text, setText] = useState('')
  const canSendMessage = current?.members.length

  const handleSend = () => {
    const sanitezedText = text.trim()
    if (!sanitezedText) return

    const message = {
      content: sanitezedText,
      userId: session.id,
      groupId: current.id,
    }

    emitEventSendMessage(message, (_, returned) => {
      updateCurrentGroup({
        messages: [...current?.messages, returned],
      })
    })

    setText('')
  }

  useEffect(() => {
    listenToMessageAdded((returned) => {
      console.log('listenToMessageAdded', returned)
      updateCurrentGroup({
        messages: [...current?.messages, returned],
      })
    })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      messageListRef?.current?.scrollToEnd({ animated: true })
    }, 500)
  }, [current?.messages])

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
              <FontAwesome5
                name="arrow-left"
                size={30}
                color={COLOR_PRIMARY_600}
              />
            }
          />
          <FormControl w="2xs">
            <Select
              onValueChange={(value) => {
                updateCurrentGroup(groups.find((g) => g.id === value))
              }}
              selectedValue={current?.id ?? 0}
              _selectedItem={{
                bg: 'primary.100',
                endIcon: (
                  <Center>
                    <CheckIcon size={5} />
                  </Center>
                ),
                fontWeight: 'semibold',
              }}
            >
              {groups?.map((g) => (
                <Select.Item key={g.id} label={g.name} value={g.id} />
              ))}
            </Select>
          </FormControl>
          <IconButton
            onPress={() => console.log('create invite')}
            rounded="full"
            icon={
              <FontAwesome5 name="plus" size={30} color={COLOR_PRIMARY_600} />
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
            // isDisabled={!canSendMessage}
            value={text}
            onChangeText={setText}
            w="95%"
            h="100%"
            placeholder="Mensagem"
            leftElement={
              <IconButton
                rounded="full"
                icon={
                  <FontAwesome5
                    name="file-image"
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
                  <FontAwesome5
                    name="reply"
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
