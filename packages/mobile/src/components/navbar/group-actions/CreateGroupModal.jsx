import { Button, FormControl, Input, Modal, Text, VStack } from 'native-base'
import { log } from '@pfg2/logger'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledTextInput } from '../../inputs/ControlledTextInput'
import { useUserGroup } from '../../../store/groups/provider'

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

  const onClose = () => {
    setModalVisible(false)
    reset()
  }

  const onSubmit = async () => {
    const name = getValues('name')
    await createGroup(name, [])
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
