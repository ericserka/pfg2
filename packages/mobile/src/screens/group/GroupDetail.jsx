import { log } from '@pfg2/logger'
import { Text } from 'native-base'
import { Button, FlatList, View } from 'react-native'
import { useUserGroup } from '../../store/groups/provider'

export const GroupDetail = ({ route }) => {
  const { id } = route.params
  const {
    state: { groups },
  } = useUserGroup()

  const group = groups.find((q) => q.id === id)

  const createInvite = () => {
    log.info('invite created successfuly')
  }

  return (
    <View>
      <Text>{group.name}</Text>
      <FlatList
        data={group.members}
        renderItem={({ item }) => (
          <>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
          </>
        )}
      />
      <Button title="invite to group" onPress={createInvite} />
    </View>
  )
}
