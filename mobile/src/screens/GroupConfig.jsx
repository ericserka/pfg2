import { useNavigation } from '@react-navigation/native'
import {
  AlertDialog,
  Button,
  Center,
  Divider,
  FlatList,
  Flex,
  Heading,
  Link,
  Switch,
  Text,
  useToast,
} from 'native-base'
import { useRef, useState } from 'react'
import { CustomButton } from '../components/buttons/CustomButton'
import { MessageBox } from '../components/MessageBox'
import { ScreenHeader } from '../components/ScreenHeader'
import { isObjectEmpty } from '../helpers/snippets'
import { toggleToast } from '../helpers/toasts/toggleToast'
import { useUserAuth } from '../store/auth/provider'
import { useUserGroup } from '../store/groups/provider'
import { useUsers } from '../store/user/provider'

export const GroupConfig = ({ route }) => {
  const {
    state: {
      groupsThatOwn,
      groups,
      mutationLoading: groupProviderMutationLoading,
      current,
    },
    actions: {
      removeUserFromGroup,
      removeGroup,
      leaveGroup,
      changeSelectedGroup,
      removeCurrentAndUpdateToFirstGroupIfPossible,
    },
  } = useUserGroup()
  const {
    state: { session },
  } = useUserAuth()
  const {
    state: { mutationLoading: userProviderMutationLoading },
    actions: { updateUser },
  } = useUsers()

  const groupId = route.params.groupId
  const group = groups.find((g) => g.id === groupId)

  const toast = useToast()
  const { navigate } = useNavigation()

  const [checked, setChecked] = useState(session.defaultGroupId === groupId)
  const [selectedUser, setSelectedUser] = useState({})
  const [deleteGroup, setDeleteGroup] = useState(false)
  const [exitGroup, setExitGroup] = useState(false)
  const userOwnsTheGroup = groupsThatOwn.some((g) => g.id === groupId)

  const dialogCancelRef = useRef(null)

  const onCloseDialog = () => {
    if (!groupProviderMutationLoading) {
      setSelectedUser({})
      setDeleteGroup(false)
      setExitGroup(false)
    }
  }

  const getDialogHeader = () =>
    deleteGroup
      ? 'Excluir grupo'
      : exitGroup
      ? 'Sair do grupo'
      : 'Remover membro'
  const getDialogBody = () =>
    deleteGroup
      ? 'Tem certeza que deseja excluir o grupo?'
      : exitGroup
      ? 'Tem certeza que deseja sair do grupo?'
      : `Tem certeza que deseja remover ${selectedUser.username} do grupo?`
  const getDialogButtonTitle = () =>
    deleteGroup ? 'Excluir' : exitGroup ? 'Sair' : 'Remover'

  const navigateToConfig = () => {
    navigate('Configurações', { tabIndex: 3 })
  }

  const handleDialogConfirmation = () => {
    if (deleteGroup) {
      removeGroup(
        { group: { id: group?.id, name: group?.name } },
        toast,
        () => {
          removeCurrentAndUpdateToFirstGroupIfPossible(groupId)
          navigateToConfig()
        }
      )
    } else if (exitGroup) {
      leaveGroup(groupId, toast, () => {
        removeCurrentAndUpdateToFirstGroupIfPossible(groupId)
        navigateToConfig()
      })
    } else {
      removeUserFromGroup(
        {
          group: { id: group?.id, name: group?.name },
          userId: selectedUser.id,
        },
        toast,
        () => {
          setSelectedUser({})
        }
      )
    }
  }

  return (
    <ScreenHeader
      right={
        <Flex direction="row" justify="space-between" align="center" m="2">
          <Text fontSize="md">Grupo padrão</Text>
          <Switch
            size="sm"
            isChecked={checked}
            onToggle={(value) => {
              setChecked(value)
              updateUser({ defaultGroupId: value ? groupId : null }, () => {
                value && changeSelectedGroup(groupId)
                toggleToast(
                  toast,
                  value
                    ? 'Grupo definido como padrão!'
                    : 'Grupo não é mais o padrão!',
                  'success'
                )
              })
            }}
            isDisabled={userProviderMutationLoading}
          />
        </Flex>
      }
    >
      <Flex p="3" direction="row" align="center" justify="space-between">
        <Heading size="sm">{`Membros do grupo '${group?.name}'`}</Heading>
        {userOwnsTheGroup ? (
          <Link
            _text={{
              color: 'primary.600',
              alignSelf: 'center',
              fontSize: 'lg',
            }}
            onPress={() => {
              navigate('Adicionar Membros', {
                id: group?.id,
                name: group?.name,
              })
            }}
          >
            Convidar mais
          </Link>
        ) : null}
      </Flex>
      <FlatList
        my="2"
        data={group?.members.filter((m) => m.id !== session.id)}
        contentContainerStyle={{ flexGrow: 1 }}
        ItemSeparatorComponent={(props) => <Divider {...props} />}
        ListEmptyComponent={() => (
          <Center mt="4">
            <MessageBox
              type="info"
              content="Você está sozinho nesse grupo."
              mt="0.5"
            />
          </Center>
        )}
        renderItem={({ item }) => (
          <Flex p="3" direction="row" align="center" justify="space-between">
            <Text bold fontSize="lg">
              {item.username}
            </Text>
            {userOwnsTheGroup ? (
              <Link
                _text={{
                  color: 'error.600',
                  alignSelf: 'center',
                  fontSize: 'lg',
                }}
                onPress={() => {
                  setSelectedUser(item)
                }}
              >
                Remover
              </Link>
            ) : null}
          </Flex>
        )}
      />

      <Center m="3">
        <CustomButton
          title={userOwnsTheGroup ? 'Excluir grupo' : 'Sair do grupo'}
          onPress={() =>
            userOwnsTheGroup ? setDeleteGroup(true) : setExitGroup(true)
          }
          colorScheme="danger"
          w="90%"
        />
      </Center>
      <AlertDialog
        leastDestructiveRef={dialogCancelRef}
        isOpen={!isObjectEmpty(selectedUser) || deleteGroup || exitGroup}
        onClose={onCloseDialog}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{getDialogHeader()}</AlertDialog.Header>
          <AlertDialog.Body>{getDialogBody()}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onCloseDialog}
                ref={dialogCancelRef}
              >
                Cancelar
              </Button>
              <CustomButton
                isDisabled={groupProviderMutationLoading}
                loading={groupProviderMutationLoading}
                title={getDialogButtonTitle()}
                onPress={handleDialogConfirmation}
                colorScheme="danger"
              />
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </ScreenHeader>
  )
}
