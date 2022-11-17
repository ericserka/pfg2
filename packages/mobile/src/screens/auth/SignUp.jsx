import { FontAwesome5 } from '@expo/vector-icons'
import { log } from '@pfg2/logger'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  Center,
  FormControl,
  HStack,
  IconButton,
  Input,
  Link,
  Stack,
  Text,
  WarningOutlineIcon,
} from 'native-base'
import { useEffect, useRef, useState } from 'react'
import { Linking } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useUserAuth } from '../../store/auth/provider'

export const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [show, setShow] = useState(false)

  const { navigate } = useNavigation()

  const pwdRef = useRef()
  const emailRef = useRef()

  const {
    authActions: { signup },
    state: { mutationLoading },
  } = useUserAuth()

  const tryToRegister = async () => {
    if (!email || !password || !user) return
    await signup({ email, name: user }, () => navigate('Entrar'))
  }
  return (
    <KeyboardAwareScrollView>
      <Center mt="24" b flex={1}>
        <Stack space={5}>
          <FormControl
            w="xs"
            isRequired
            isInvalid={!user.length || user.length < 2}
          >
            <FormControl.Label>Usuário</FormControl.Label>
            <Input
              onChangeText={(text) => setUser(text)}
              h="12"
              placeholder="Nome de exibição do OpenStreetMap"
              autoCapitalize="none"
              autoComplete="off"
              InputLeftElement={
                <Center ml="3">
                  <FontAwesome5 name="user-circle" size={15} />
                </Center>
              }
              onSubmitEditing={() => emailRef.current.focus()}
            />
            <FormControl.HelperText>
              <Text fontSize={12}>
                Seu usuário deve ser o mesmo do{' '}
                <Link
                  isExternal
                  onPress={() =>
                    Linking.openURL(
                      'https://www.openstreetmap.org/account/edit'
                    )
                  }
                >
                  OpenStreetMap
                </Link>
              </Text>
            </FormControl.HelperText>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              <Text>
                Caso não possua cadastro no OpenStreetMap{' '}
                <Link
                  isExternal
                  onPress={() =>
                    Linking.openURL('https://www.openstreetmap.org/user/new')
                  }
                >
                  clique aqui.
                </Link>
              </Text>
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl w="xs" isRequired isInvalid={!email.length}>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              ref={emailRef}
              onChangeText={(text) => setEmail(text)}
              h="12"
              placeholder="Email"
              autoCapitalize="none"
              autoComplete="email"
              InputLeftElement={
                <Center ml="3">
                  <FontAwesome5 name="envelope" size={15} />
                </Center>
              }
              onSubmitEditing={() => pwdRef.current.focus()}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Não parece ser um endereço de e-mail válido
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            w="xs"
            isRequired
            isInvalid={!password.length || password.length < 6}
          >
            <FormControl.Label>Senha</FormControl.Label>
            <Input
              ref={pwdRef}
              h="12"
              type={show ? 'text' : 'password'}
              placeholder="Senha"
              onChangeText={(text) => setPassword(text)}
              autoComplete="password"
              autoCapitalize="none"
              InputLeftElement={
                <Center ml="3.5">
                  <FontAwesome5 name="lock" size={20} />
                </Center>
              }
              InputRightElement={
                <Center>
                  <IconButton
                    rounded="full"
                    onPress={() => setShow((v) => !v)}
                    icon={
                      <FontAwesome5
                        size={20}
                        name={show ? 'eye-slash' : 'eye'}
                        color="black"
                      />
                    }
                  />
                </Center>
              }
              onSubmitEditing={tryToRegister}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Sua senha deve conter pelo menos 6 caracteres
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            colorScheme="darkBlue"
            onPress={tryToRegister}
            isDisabled={!email || !password || !user || mutationLoading}
          >
            <Text color="white" fontSize="lg">
              Registrar
            </Text>
          </Button>
          <Center>
            <HStack space="1">
              <Text>Já possui uma conta?</Text>
              <Link
                _text={{
                  color: 'blue.600',
                }}
                onPress={() => navigate('Entrar')}
              >
                Entrar
              </Link>
            </HStack>
          </Center>
        </Stack>
      </Center>
    </KeyboardAwareScrollView>
  )
}
