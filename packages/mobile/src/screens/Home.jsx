import { FontAwesome5 } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from '@pfg2/dayjs'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Column, FlatList, Heading, Text } from 'native-base'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as z from 'zod'
import { ControlledTextInput } from '../components/inputs/ControlledTextInput'
import { CenterLoading } from '../components/loading/CenterLoading'
import { AsyncAlert } from '../components/utils/AsyncAlert'
import { api } from '../services/api/axios'
import { emitEventSendMessage } from '../services/api/socket'
import { useHello } from '../store/hello/provider'
import { useUsers } from '../store/users/provider'
import { Alert } from 'react-native'
import { isObjectEmpty } from '@pfg2/snippets'

export const Home = () => {
  const { helloState, helloActions } = useHello()
  const navigation = useNavigation()
  const { usersState, usersActions } = useUsers()
  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().nullish(),
        email: z.string().min(1, 'Obrigatório').email('E-mail inválido'),
      })
    ),
  })

  const {
    isFetching: isUsersFetching,
    isSuccess: isUsersSuccess,
    isError: isUsersError,
    refetch: refetchUsers,
    error: usersError,
  } = useQuery(['users'], () => api.get('/users'), {
    onSuccess: ({ data }) => {
      usersActions.setUsers(data)
    },
    onError: (error) => {
      console.log(error.message)
    },
  })
  const { isLoading: isUserCreationLoading, mutate: mutateUser } = useMutation(
    (data) => api.post('/users', data),
    {
      onSuccess: () => {
        reset()
        Alert.alert('usuário criado com sucesso', '')
        refetchUsers()
      },
      onError: (error) => {
        Alert.alert(error.response.data.message, '')
      },
    }
  )
  useFocusEffect(
    useCallback(() => {
      refetchUsers()
    }, [])
  )

  const onSubmit = (data) => {
    mutateUser(data)
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <Text>Home</Text>
      {/* it is possible to change the color and size of the icons easily */}
      <FontAwesome5 name="location-arrow" size={20} color="blue" />
      <Button onPress={() => navigation.navigate('SignIn')}>SignIn</Button>
      <Button
        onPress={async () => await AsyncAlert('alert title', 'alert body')}
      >
        Async Alert
      </Button>
      <Text>{dayjs().format()}</Text>
      <Button
        onPress={() => {
          emitEventSendMessage(helloActions.newMessage)
        }}
      >
        Add new message
      </Button>
      <Heading>User form</Heading>
      <Column space={5}>
        <ControlledTextInput
          control={control}
          name="name"
          isRequired={false}
          label="Name"
          onBlur={() => trigger()}
          placeholder="Name"
        />
        <ControlledTextInput
          control={control}
          name="email"
          isRequired
          errorMessage={errors?.email?.message}
          label="E-mail"
          keyboardType="email-address"
          onBlur={() => trigger()}
          placeholder="E-mail"
        />
        <Button
          onPress={handleSubmit(onSubmit)}
          mt="5"
          colorScheme="cyan"
          disabled={isUserCreationLoading || !isObjectEmpty(errors) || !isDirty}
        >
          {isUserCreationLoading ? 'Loading...' : 'Submit'}
        </Button>
      </Column>
      <Heading>User list</Heading>
      {isUsersFetching ? (
        <CenterLoading />
      ) : isUsersSuccess ? (
        <FlatList
          data={usersState.users}
          renderItem={({ item }) => (
            <>
              <Text>{item.name}</Text>
              <Text>{item.email}</Text>
            </>
          )}
        />
      ) : isUsersError ? (
        <Text>{usersError.message}</Text>
      ) : (
        <></>
      )}
      <Heading>List messages</Heading>
      <FlatList
        data={helloState.messages}
        renderItem={({ item }) => (
          <>
            <Text>{item.datetime}</Text>
            <Text>{item.content}</Text>
          </>
        )}
      />
    </SafeAreaView>
  )
}
