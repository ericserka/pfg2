import { FontAwesome } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Center,
  FlatList,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { COLOR_PRIMARY_600 } from '../constants'
import { toggleToast } from '../helpers/toasts/toggleToast'
import { useUserAuth } from '../store/auth/provider'
import { useUserGroup } from '../store/groups/provider'
import { useUsers } from '../store/user/provider'
import { CustomButton } from './buttons/CustomButton'
import { ControlledTextInput } from './inputs/ControlledTextInput'
import { ScreenHeader } from './ScreenHeader'

export const InviteUsersForm = ({ route }) => {
  const group = route?.params

  const {
    state: { mutationLoading },
    actions: { createGroup, addMembersToGroup },
  } = useUserGroup()
  const {
    state: { mutationLoading: searchLoading },
    actions: { findUserByUsername },
  } = useUsers()
  const {
    state: { session },
  } = useUserAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [membersToInvite, setMembersToInvite] = useState([])

  const toast = useToast()

  const {
    control,
    trigger,
    formState: { isDirty, isValid },
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(
      z.object({
        groupName: z
          .string()
          .min(1, 'Obrigatório')
          .max(16, 'Máximo de 16 caracteres'),
      })
    ),
  })

  const submitCreateGroup = () => {
    createGroup(
      { ...getValues(), membersToInviteIds: membersToInvite.map((m) => m.id) },
      toast,
      () => {
        reset()
        setMembersToInvite([])
      }
    )
  }

  const submitAddMembersToGroup = () => {
    addMembersToGroup(
      { group, membersToInviteIds: membersToInvite.map((m) => m.id) },
      toast,
      () => {
        setMembersToInvite([])
      }
    )
  }

  const searchUser = async () => {
    const sanitizedSearch = searchTerm.trim()
    if (membersToInvite.some((m) => m.username === sanitizedSearch)) {
      toggleToast(
        toast,
        'Usuário já adicionado na sua lista de convites.',
        'warning'
      )
    } else if (sanitizedSearch === session.username) {
      toggleToast(toast, 'Não é possível convidar você mesmo.', 'warning')
    } else {
      const searchedUser = await findUserByUsername(sanitizedSearch)
      if (searchedUser) {
        searchedUser.groups.some((g) => g.id === group.id)
          ? toggleToast(toast, 'Usuário já é membro do grupo.', 'warning')
          : setMembersToInvite((prevState) => [...prevState, searchedUser])
      }
    }
    setSearchTerm('')
  }

  return (
    <ScreenHeader>
      <Center m="3">
        <Stack space={5}>
          <FormControl>
            <FormControl.Label _text={{ bold: true }}>
              Convide pessoas para serem membros
            </FormControl.Label>
            <Flex direction="row" justify="space-between" align="center">
              <Input
                placeholder="Busque pelo nome de usuário"
                borderRadius="4"
                p="3"
                value={searchTerm}
                onChangeText={(text) => setSearchTerm(text)}
                onSubmitEditing={() => searchTerm.length > 0 && searchUser()}
                rightElement={
                  <IconButton
                    onPress={searchUser}
                    icon={
                      <FontAwesome
                        name="search"
                        size={25}
                        color={COLOR_PRIMARY_600}
                      />
                    }
                    isDisabled={searchLoading || searchTerm.length === 0}
                  />
                }
              />
            </Flex>
          </FormControl>
          <Heading fontSize="lg" textAlign="center">
            Usuários a serem convidados
          </Heading>
          <FlatList
            maxH="20"
            data={membersToInvite}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <Center>
                <Text fontSize={13} color="gray.400" maxW="xs">
                  Os usuários aparecerão logo abaixo à medida que você for
                  adicionando.
                </Text>
              </Center>
            )}
            renderItem={({ item }) => (
              <Flex
                align="center"
                direction="row"
                justify="space-between"
                key={item.id}
              >
                <Text>{item.username}</Text>
                <IconButton
                  icon={<FontAwesome name="trash" size={25} color="red" />}
                  onPress={() =>
                    setMembersToInvite((prevState) =>
                      prevState.filter((m) => m.id !== item.id)
                    )
                  }
                />
              </Flex>
            )}
          />
          {group ? null : (
            <Center>
              <ControlledTextInput
                control={control}
                name="groupName"
                label="Nome do grupo"
                onBlur={() => trigger('groupName')}
                p="3"
              />
            </Center>
          )}
          <CustomButton
            isDisabled={
              group
                ? membersToInvite.length === 0 || mutationLoading
                : !isDirty ||
                  !isValid ||
                  mutationLoading ||
                  membersToInvite.length === 0
            }
            loading={mutationLoading}
            title={group ? 'Convidar' : 'Criar'}
            onPress={() =>
              group ? submitAddMembersToGroup() : submitCreateGroup()
            }
          />
        </Stack>
      </Center>
    </ScreenHeader>
  )
}
