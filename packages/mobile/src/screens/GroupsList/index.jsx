import { sanitizeText } from '@pfg2/snippets'
import { useNavigation } from '@react-navigation/native'
import { Box, Center, FlatList, Pressable, Text, VStack } from 'native-base'
import { useState } from 'react'
import DebounceInput from 'react-native-debounce-input'
import { SafeAreaView } from 'react-native-safe-area-context'

export const GroupsList = () => {
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

  const [search, setSearch] = useState('')

  const { navigate } = useNavigation()

  const filteredGroups =
    search.length > 0
      ? groups?.filter((q) =>
          sanitizeText(q.name).toLowerCase().includes(search.toLowerCase())
        )
      : groups

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <Center pt="5">
        <DebounceInput
          value={search}
          defaultValue=""
          returnKeyType="search"
          keyboardType="default"
          minLength={1}
          placeholder={search.length > 0 ? search : 'Busque pelo nome do grupo'}
          delayTimeout={500}
          clearButtonMode="while-editing"
          onChangeText={(v) => setSearch(sanitizeText(v))}
          style={{
            marginTop: 6,
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 12,
            width: '86%',
            borderWidth: 1,
            borderColor: '#ccc',
          }}
        />
      </Center>
      <FlatList
        data={filteredGroups}
        contentContainerStyle={{ flexGrow: 1 }}
        ItemSeparatorComponent={(props) => <Box pt="2" {...props} />}
        ListEmptyComponent={() => (
          <Center flex={1}>
            <Text fontSize={20} fontWeight="semibold">
              Nenhum grupo encontrado 😭
            </Text>
          </Center>
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            shadow={1}
            onPress={() => navigate('DetalhesGrupo', { id: item.id })}
          >
            <Center px={3}>
              <Text fontSize={28} bold textAlign="center">
                {item.name}
              </Text>
              <FlatList
                data={item.users}
                contentContainerStyle={{ flexGrow: 1 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <VStack space={3}>
                    <Text>{item.name}</Text>
                  </VStack>
                )}
              />
            </Center>
          </Pressable>
        )}
      />
    </SafeAreaView>
  )
}
