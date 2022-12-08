import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Modal, useToast } from 'native-base'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { handleSocketResponse } from '../../../helpers/feedback/handleSocketResponse'
import { useUserAuth } from '../../../store/auth/provider'
import { useUserGroup } from '../../../store/groups/provider'
import { useWebSocket } from '../../../store/websocket/provider'
import { ControlledTextInput } from '../../inputs/ControlledTextInput'

export const CreateGroupModal = ({ modalVisible, setModalVisible }) => {
  const {
    control,
    handleSubmit,
    trigger,
    reset,
    getValues,
    formState: { isDirty, isValid },
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string(),
      })
    ),
  })

  const {
    actions: { createGroup },
  } = useUserGroup()
  const {
    actions: { emitEventCreateGroup },
  } = useWebSocket()
  const {
    state: { session },
  } = useUserAuth()

  const onClose = () => {
    setModalVisible(false)
    reset()
  }

  const toast = useToast()

  const onSubmit = async () => {
    const groupName = getValues('name')
    emitEventCreateGroup(
      { groupName, membersToInviteIds: [2], user: { ...session } },
      (response) => {
        handleSocketResponse(response, toast)
      }
    )
    onClose()
  }

  return (
    <Modal
      isOpen={modalVisible}
      onClose={onClose}
      avoidKeyboard
      justifyContent="center"
      size="lg"
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Escolha um nome para o grupo</Modal.Header>
        <Modal.Body>
          <ControlledTextInput
            control={control}
            name="name"
            label="Nome do Grupo"
            placeholder="Nome"
            onBlur={() => trigger('name')}
            keyboardType="name"
            autoCapitalize="none"
            w="5/6"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button isDisabled={!isValid} flex="1" onPress={onSubmit}>
            Criar
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
