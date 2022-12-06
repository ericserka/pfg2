import { FontAwesome } from '@expo/vector-icons'
import { IconButton, Row, Spinner, Text, useToast } from 'native-base'
import { useState } from 'react'
import { COLOR_ERROR_600, COLOR_SUCCESS_600 } from '../../../constants'
import { toggleToast } from '../../../helpers/toasts/toggleToast'
import { useUserAuth } from '../../../store/auth/provider'
import { useNotifications } from '../../../store/notifications/provider'
import { useWebSocket } from '../../../store/websocket/provider'

export const InviteAction = ({ notification }) => {
  const {
    actions: { updateNotification },
  } = useNotifications()
  const {
    actions: { emitEventRejectGroupInvite, emitEventAcceptGroupInvite },
  } = useWebSocket()
  const {
    state: { session },
  } = useUserAuth()
  const toast = useToast()
  const [mutationLoading, setMutationLoading] = useState(false)

  const RowChildren = () => {
    switch (notification.status) {
      case 'PENDING':
        return (
          <>
            {mutationLoading ? (
              <Spinner />
            ) : (
              <>
                <IconButton
                  onPress={() => {
                    setMutationLoading(true)
                    emitEventAcceptGroupInvite(
                      notification.id,
                      notification.groupId,
                      session.id,
                      ({ success, message }) => {
                        setMutationLoading(false)
                        if (success) {
                          updateNotification({
                            id: notification.id,
                            seen: true,
                            status: 'ACCEPTED',
                          })
                          toggleToast(toast, message, 'success')
                        } else {
                          toggleToast(toast, message, 'error')
                        }
                      }
                    )
                  }}
                  icon={
                    <FontAwesome
                      name="check"
                      size={25}
                      color={COLOR_SUCCESS_600}
                    />
                  }
                  isDisabled={mutationLoading}
                />
                <IconButton
                  onPress={() => {
                    setMutationLoading(true)
                    emitEventRejectGroupInvite(
                      notification.id,
                      ({ success, message }) => {
                        setMutationLoading(false)
                        if (success) {
                          updateNotification({
                            id: notification.id,
                            seen: true,
                            status: 'REJECTED',
                          })
                          toggleToast(toast, message, 'success')
                        } else {
                          toggleToast(toast, message, 'error')
                        }
                      }
                    )
                  }}
                  icon={
                    <FontAwesome
                      name="remove"
                      size={25}
                      color={COLOR_ERROR_600}
                    />
                  }
                  isDisabled={mutationLoading}
                />
              </>
            )}
          </>
        )
      case 'ACCEPTED':
        return (
          <Text bold fontSize="xl" color="success.600" alignSelf="center">
            Já aceito
          </Text>
        )
      case 'REJECTED':
        return (
          <Text bold fontSize="xl" color="error.600" alignSelf="center">
            Não aceito
          </Text>
        )
      default:
        return <></>
    }
  }

  return (
    <Row>
      <RowChildren />
    </Row>
  )
}
