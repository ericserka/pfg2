import { FontAwesome } from '@expo/vector-icons'
import { IconButton, Row, Spinner, Text, useToast } from 'native-base'
import { COLOR_ERROR_600, COLOR_SUCCESS_600 } from '../../../constants'
import { useNotifications } from '../../../store/notifications/provider'

export const InviteAction = ({ notification }) => {
  const {
    state: { mutationLoading },
    actions: { acceptGroupInvite, rejectGroupInvite },
  } = useNotifications()
  const toast = useToast()

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
                  onPress={() =>
                    acceptGroupInvite(
                      notification.id,
                      notification.groupId,
                      toast
                    )
                  }
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
                  onPress={() => rejectGroupInvite(notification.id, toast)}
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
