import { Button, FormControl, Input, Modal, Text, VStack } from 'native-base'
import { useUserGroup } from '../store/groups/provider'

export const ChatActions = ({ modalVisible, setModalVisible }) => {
  const {
    state: { current, groups },
  } = useUserGroup()

  return (
    <Modal
      isOpen={modalVisible}
      onClose={() => setModalVisible(false)}
      avoidKeyboard
      justifyContent="center"
      size="lg"
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>
          {current ? 'Envie este código para os amigos' : 'Entre em um grupo'}
        </Modal.Header>
        <Modal.Body>
          {current ? (
            <VStack space={3}>
              <Text>Envie o código abaixo para os amigos</Text>
              <Text fontSize="xl">{current.code}</Text>
              {current.inviteCode}
            </VStack>
          ) : (
            <Text textAlign="center">
              Para entrar em um grupo, basta informar o código do grupo.
            </Text>
          )}

          <FormControl mt="3">
            <FormControl.Label>Código </FormControl.Label>
            <Input />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button
            flex="1"
            onPress={() => {
              setModalVisible(false)
              emitEventJoinGroup(session.id, code, (err, group) => {
                if (err) {
                  console.log('err', err)
                  return
                }

                updateCurrentGroup(group)
              })
            }}
          >
            Entrar
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
