import { useNavigation } from '@react-navigation/native'
import { Link, Row } from 'native-base'

export const HelpAction = ({ sender }) => {
  const { navigate } = useNavigation()
  return (
    <Row>
      <Link
        _text={{
          color: 'primary.600',
          alignSelf: 'center',
        }}
        // onPress={() => navigate('Help', {user: sender})}
      >
        Acompanhar {sender.username}
      </Link>
    </Row>
  )
}
