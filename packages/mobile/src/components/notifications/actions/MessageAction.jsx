import { useNavigation } from '@react-navigation/native'
import { Link, Row } from 'native-base'

export const MessageAction = ({ group }) => {
  const { navigate } = useNavigation()
  return (
    <Row>
      <Link
        _text={{
          color: 'primary.600',
          alignSelf: 'center',
        }}
        // onPress={() => navigate('Chat', {group})}
      >
        Visualizar chat
      </Link>
    </Row>
  )
}
