import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { Avatar, Flex, Pressable } from 'native-base'
import { useUserAuth } from '../../store/auth/provider'

export const Left = (props) => {
  const {
    state: { session },
  } = useUserAuth()

  const pickImage = async () => {
    const pickedImage = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: false,
      base64: true,
    })

    if (!pickedImage || pickedImage.cancelled) return

    console.log(`data:image/jpeg;base64,${pickedImage.base64.substring(0, 10)}`)
  }

  return (
    <Flex ml="3" align="center" justify="center" direction="column" {...props}>
      <Pressable onPress={pickImage}>
        <Avatar
          source={{
            uri: session.profilePic,
          }}
          borderColor={'black'}
          borderWidth={1}
        >
          <Avatar.Badge bg="green.600" />
        </Avatar>
      </Pressable>
    </Flex>
  )
}
