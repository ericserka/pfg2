import { useNavigation } from '@react-navigation/native'
import { Center, Divider, FlatList, Flex, Link, Text } from 'native-base'
import { useUserGroup } from '../../store/groups/provider'
import { MessageBox } from '../MessageBox'

export const GroupsList = () => {
  const { navigate } = useNavigation()

  const {
    state: { groups },
  } = useUserGroup()

  return (
    <FlatList
      my="2"
      data={groups}
      contentContainerStyle={{ flexGrow: 1 }}
      ItemSeparatorComponent={(props) => <Divider {...props} />}
      ListEmptyComponent={() => (
        <Center mt="4">
          <MessageBox
            type="info"
            content="Não há grupos para listar."
            mt="0.5"
          />
        </Center>
      )}
      renderItem={({ item }) => (
        <Flex p="3" direction="row" align="center" justify="space-between">
          <Text bold fontSize="lg">
            {item.name}
          </Text>
          <Link
            _text={{
              color: 'primary.600',
              alignSelf: 'center',
              fontSize: 'lg',
            }}
            onPress={() => {
              navigate('Configurações Grupo', { groupId: item.id })
            }}
          >
            Configurações
          </Link>
        </Flex>
      )}
    />
  )
}
