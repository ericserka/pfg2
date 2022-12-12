import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import {
  Center,
  Pressable,
  Avatar,
  Text,
  Row,
  WarningOutlineIcon,
} from 'native-base'
import { FontAwesome } from '@expo/vector-icons'

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
    if (!result.canceled) {
      setValue(name, `data:image/jpeg;base64,${result.assets[0].base64}`, {
        shouldDirty: true,
      })
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
          <FontAwesome size={40} name="image" />
          <Text fontSize="xs">Aperte aqui</Text>
        </Avatar>
      </Pressable>
      <Text>
        {label}
        <Text color="error.600">*</Text>
      </Text>
      {errorMessage ? (
        <Row space={1} justifyContent="center">
          <WarningOutlineIcon mt="0.5" color="error.600" />
          <Text color="error.600">
            {errorMessage === 'Required'
              ? 'Selecione uma imagem'
              : errorMessage}
          </Text>
        </Row>
      ) : null}
    </Center>
  )
}
