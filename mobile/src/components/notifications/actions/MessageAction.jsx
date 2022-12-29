import { useNavigation } from '@react-navigation/native'
import { Link, Row } from 'native-base'
import { useUserGroup } from '../../../store/groups/provider'

export const MessageAction = ({ groupId }) => {
  const { navigate } = useNavigation()
  const {
    actions: { changeSelectedGroup },
  } = useUserGroup()
  return (
    <Row>
      <Link
        _text={{
          color: 'primary.600',
          alignSelf: 'center',
        }}
        onPress={() => {
          changeSelectedGroup(groupId)
          navigate('Chat')
        }}
      >
        Visualizar chat
      </Link>
    </Row>
  )
}
