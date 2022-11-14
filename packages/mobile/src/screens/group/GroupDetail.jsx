import { Text } from 'native-base'
import { Button, FlatList, View } from 'react-native'

const groups = [
  {
    id: 'aoiusdsioad834983',
    name: 'grupo 1',
    users: [
      {
        id: '213sfggcxzas35',
        name: 'Eric',
        email: 'eric@email.com',
      },
    ],
  },
  {
    id: 'aoiusdsio5677ad834983',
    name: 'grupo 2',
    users: [
      {
        id: '213sfggcxzas35',
        name: 'Eric',
        email: 'eric@email.com',
      },
      {
        id: '213sfg465gcxzas35',
        name: 'Yuri',
        email: 'yuri@email.com',
      },
    ],
  },
]

export const GroupDetail = ({ route }) => {
  const { id } = route.params
  const group = groups.find((q) => q.id === id)

  const createInvite = () => {
    console.log('invite created successfuly')
  }

  return (
    <View>
      <Text>{group.name}</Text>
      <FlatList
        data={group.users}
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
