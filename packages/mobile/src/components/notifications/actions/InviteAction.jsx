import { FontAwesome } from '@expo/vector-icons'
import { IconButton, Row, Text } from 'native-base'
import { useEffect } from 'react'
import { COLOR_ERROR_600, COLOR_SUCCESS_600 } from '../../../constants'
import { useNotifications } from '../../../store/notifications/provider'

export const InviteAction = ({ status }) => {
  const {
    actions: { acceptGroupInvite, rejectGroupInvite },
    state: { mutationLoading, non_read_notifications_amount },
  } = useNotifications()

  const RowChildren = () => {
    switch (status) {
      case 'PENDING':
        return (
          <>
            <IconButton
              onPress={() => acceptGroupInvite('data')}
              icon={
                <FontAwesome name="check" size={25} color={COLOR_SUCCESS_600} />
              }
              isDisabled={mutationLoading}
            />
            <IconButton
              onPress={() => rejectGroupInvite('data')}
              icon={
                <FontAwesome name="remove" size={25} color={COLOR_ERROR_600} />
              }
              isDisabled={mutationLoading}
            />
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
