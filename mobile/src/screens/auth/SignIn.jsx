import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import { Center, Row, Image, Link, Stack, Text } from 'native-base'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as z from 'zod'
import { CustomButton } from '../../components/buttons/CustomButton'
import { ControlledPasswordInput } from '../../components/inputs/ControlledPasswordInput'
import { ControlledTextInput } from '../../components/inputs/ControlledTextInput'
import { generateRandomPassword } from '../../helpers/snippets'
import { useUserAuth } from '../../store/auth/provider'

export const SignIn = () => {
  const { navigate } = useNavigation()

  const {
    control,
    handleSubmit,
    trigger,
    formState: { isDirty, isValid, errors },
    getValues,
  } = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email('E-mail inválido'),
        password: z.string(),
      })
    ),
  })

  const pwdRef = useRef()

  const {
    actions: { signin, saveRandomUserPassword },
    state: { mutationLoading },
  } = useUserAuth()

  const onSubmit = async (data) => {
    await signin(data)
  }

  return (
    <KeyboardAwareScrollView>
      <Center>
        <Stack space={5}>
          <Center>
            <Image
              mt="10"
              size="2xl"
              source={require('../../../assets/child-safe-zone.png')}
              alt="logo"
            />
          </Center>
          <ControlledTextInput
            control={control}
            name="email"
            label="E-mail"
            onBlur={() => trigger('email')}
            onSubmitEditing={() => pwdRef.current.focus()}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
          />
          <ControlledPasswordInput
            ref={pwdRef}
            control={control}
            name="password"
            label="Senha"
            onBlur={() => trigger('password')}
            onSubmitEditing={handleSubmit(onSubmit)}
          />
          <CustomButton
            isDisabled={!isValid || !isDirty || mutationLoading}
            loading={mutationLoading}
            title="Entrar"
            onPress={handleSubmit(onSubmit)}
          />
          <Center>
            <Row space="1">
              <Text>Esqueceu sua senha?</Text>
              <Link
                _text={{
                  color: 'primary.600',
                }}
                onPress={async () => {
                  const email = getValues('email')
                  if (!errors?.email && email) {
                    const password = generateRandomPassword()
                    await saveRandomUserPassword(
                      {
                        password,
                        email,
                      },
                      () => {
                        Alert.alert(
                          'Nova senha',
                          `Sua nova senha é: ${password}. Memorize-a para realizar o login. Você poderá alterá-la em seu perfil posteriormente.`
                        )
                      }
                    )
                  } else {
                    Alert.alert('Erro', 'Preencha o e-mail corretamente.')
                  }
                }}
              >
                Aperte aqui
              </Link>
            </Row>
          </Center>
          <Center>
            <Row space="1">
              <Text>Não possui uma conta?</Text>
              <Link
                _text={{
                  color: 'primary.600',
                }}
                onPress={() => navigate('Cadastrar')}
              >
                Cadastre-se agora
              </Link>
            </Row>
          </Center>
        </Stack>
      </Center>
    </KeyboardAwareScrollView>
  )
}
