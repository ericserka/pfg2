import { useNavigation } from '@react-navigation/native'
import { Center, Link, Row, Text, useToast } from 'native-base'
import { UserForm } from '../../components/UserForm'
import { removeSpecialCharacters } from '../../helpers/snippets'
import { toggleToast } from '../../helpers/toasts/toggleToast'
import { useUserAuth } from '../../store/auth/provider'

export const SignUp = () => {
  const { navigate } = useNavigation()
  const toast = useToast()

  const {
    actions: { signup },
    state: { mutationLoading },
  } = useUserAuth()

  const onSubmit = async (data) => {
    await signup(
      {
        ...data,
        confirmPassword: undefined,
        phoneNumber: removeSpecialCharacters(data.phoneNumber),
      },
      () => {
        navigate('Entrar')
        toggleToast(toast, 'Cadastro realizado com sucesso!', 'success')
      }
    )
  }

  return (
    <UserForm
      buttonTitle="Registrar"
      defaultValues={{ phoneNumber: '+55' }}
      mutationLoading={mutationLoading}
      onSubmit={onSubmit}
      signUp
    >
      <Center>
        <Row space="1">
          <Text>Já possui uma conta?</Text>
          <Link
            _text={{
              color: 'primary.600',
            }}
            onPress={() => navigate('Entrar')}
          >
            Entrar
          </Link>
        </Row>
      </Center>
    </UserForm>
  )
}
