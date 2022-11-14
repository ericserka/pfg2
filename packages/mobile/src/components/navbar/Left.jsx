import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { Avatar, Flex, Pressable } from 'native-base'

export const Left = (props) => {
  const pickImage = async () => {
    await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: false,
    })
  }

  return (
    <Flex ml="3" align="center" justify="center" direction="column" {...props}>
      <Pressable onPress={pickImage}>
        <Avatar
          source={{
            uri: 'https://preview.redd.it/dh5otp8kcf741.png?width=640&crop=smart&auto=webp&s=d795f12b5e3eea1ef4d7ceb8244fca98e2384dbf',
          }}
          borderColor={'black'}
          borderWidth={1}
        >
          <Avatar.Badge bg="green.500" />
        </Avatar>
      </Pressable>
    </Flex>
  )
}
