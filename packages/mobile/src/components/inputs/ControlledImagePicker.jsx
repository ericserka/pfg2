import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import {
  Center,
  Pressable,
  Avatar,
  Text,
  Row,
  WarningOutlineIcon,
} from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons'

export const ControlledImagePicker = ({
  name,
  setValue,
  trigger,
  watch,
  label,
  errorMessage,
}) => {
  const pickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: false,
      base64: true,
    })
    if (!result.cancelled) {
      setValue(name, `data:image/jpeg;base64,${result.base64}`)
    }
    trigger(name)
  }
  return (
    <Center>
      <Pressable onPress={pickImage}>
        <Avatar
          source={{
            uri: watch(name),
          }}
          size="2xl"
          borderWidth="2"
          borderColor="green.800"
        >
          <FontAwesome5 size={40} name="image" color="black" />
          <Text fontSize="xs">Aperte aqui</Text>
        </Avatar>
      </Pressable>
      <Text>
        {label}
        <Text color="error.500">*</Text>
      </Text>
      {errorMessage ? (
        <Row space={1} justifyContent="center">
          <WarningOutlineIcon mt="0.5" color="error.500" />
          <Text color="error.500">
            {errorMessage === 'Required'
              ? 'Selecione uma imagem'
              : errorMessage}
          </Text>
        </Row>
      ) : null}
    </Center>
  )
}
