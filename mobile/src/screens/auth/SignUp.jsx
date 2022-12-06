import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import { Center, Link, Row, Stack, Text, useToast } from 'native-base'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as z from 'zod'
import { CustomButton } from '../../components/buttons/CustomButton'
import { ControlledImagePicker } from '../../components/inputs/ControlledImagePicker'
import { ControlledPasswordInput } from '../../components/inputs/ControlledPasswordInput'
import { ControlledSelectInput } from '../../components/inputs/ControlledSelectInput'
import { ControlledTextInput } from '../../components/inputs/ControlledTextInput'
import { removeSpecialCharacters } from '../../helpers/snippets'
import { toggleToast } from '../../helpers/toasts/toggleToast'
import { useUserAuth } from '../../store/auth/provider'

export const SignUp = () => {
  const { navigate } = useNavigation()
  const toast = useToast()

  const emailRef = useRef()
  const usernameRef = useRef()
  const phoneRef = useRef()
  const birthdayRef = useRef()
  const confirmPasswordRef = useRef()

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

  const {
    control,
    handleSubmit,
    trigger,
    formState: { isValid, isDirty, errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      phoneNumber: '+55',
    },
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, 'Obrigatório'),
        username: z
          .string()
          .min(1, 'Obrigatório')
          .max(16, 'Máximo de 16 caracteres'),
        email: z.string().min(1, 'Obrigatório').email('E-mail inválido'),
        phoneNumber: z.string().min(19, 'Obrigatório'),
        birthday: z.string().min(10, 'Obrigatório'),
        gender: z.enum([
          'MALE_CIS',
          'FEMALE_CIS',
          'MALE_TRANS',
          'FEMALE_TRANS',
          'NON_BINARY',
          'FLUID',
          'OTHER',
          'PREFER_NOT_TO_INFORM',
        ]),
        sexualOrientation: z.enum([
          'HETEROSEXUAL',
          'BISEXUAL',
          'ASEXUAL',
          'HOMOSEXUAL',
          'OTHER',
          'PREFER_NOT_TO_INFORM',
        ]),
        ethnicity: z.enum([
          'WHITE_COLOR',
          'BLACK_COLOR',
          'YELLOW_COLOR',
          'INDIGENOUS_ETHNICITY',
          'OTHER',
          'PREFER_NOT_TO_INFORM',
        ]),
        password: z
          .string()
          .min(8, 'Mínimo de 8 caracteres')
          .max(16, 'Máximo de 16 caracteres')
          .refine((val) => val === watch('confirmPassword'), {
            message: 'As senhas não coincidem',
          }),
        confirmPassword: z
          .string()
          .min(8, 'Mínimo de 8 caracteres')
          .max(16, 'Máximo de 16 caracteres')
          .refine((val) => val === watch('password'), {
            message: 'As senhas não coincidem',
          }),
        profilePic: z.string().min(1, 'Selecione uma foto para o seu perfil'),
      })
    ),
  })

  return (
    <KeyboardAwareScrollView>
      <Center my="16" flex={1}>
        <Stack space={5}>
          <ControlledImagePicker
            name="profilePic"
            setValue={setValue}
            trigger={trigger}
            watch={watch}
            label="Foto de perfil"
            errorMessage={errors?.profilePic?.message}
          />
          <ControlledTextInput
            control={control}
            name="name"
            label="Nome"
            onBlur={() => trigger('name')}
            onSubmitEditing={() => usernameRef.current.focus()}
          />
          <ControlledTextInput
            ref={usernameRef}
            control={control}
            name="username"
            label="Nome de usuário"
            onBlur={() => trigger('username')}
            helperText="Este nome será exibido para outros usuários"
            onSubmitEditing={() => emailRef.current.focus()}
            autoCapitalize="none"
          />
          <ControlledTextInput
            ref={emailRef}
            control={control}
            name="email"
            label="E-mail"
            onBlur={() => trigger('email')}
            helperText="Será usado para entrar na sua conta"
            onSubmitEditing={() => phoneRef.current.focus()}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
          />
          <ControlledTextInput
            ref={phoneRef}
            control={control}
            name="phoneNumber"
            label="Número de telefone"
            onBlur={() => trigger('phoneNumber')}
            placeholder="+99 (99) 99999-9999"
            masked
            mask="+99 (99) 99999-9999"
            helperText="Código do país + DDD + número"
            keyboardType="phone-pad"
            onSubmitEditing={() => birthdayRef.current.focus()}
          />
          <ControlledTextInput
            ref={birthdayRef}
            control={control}
            name="birthday"
            label="Data de nascimento"
            onBlur={() => trigger('birthday')}
            placeholder="DD/MM/AAAA"
            masked
            mask="99/99/9999"
            keyboardType="phone-pad"
          />
          <ControlledSelectInput
            control={control}
            name="gender"
            label="Gênero"
            trigger={trigger}
            items={[
              { label: 'Homem cisgênero', value: 'MALE_CIS' },
              { label: 'Mulher cisgênero', value: 'FEMALE_CIS' },
              { label: 'Homem transgênero', value: 'MALE_TRANS' },
              { label: 'Mulher transgênero', value: 'FEMALE_TRANS' },
              { label: 'Não binário', value: 'NON_BINARY' },
              { label: 'Gênero fluído', value: 'FLUID' },
              { label: 'Outro', value: 'OTHER' },
              { label: 'Prefiro não informar', value: 'PREFER_NOT_TO_INFORM' },
            ]}
          />
          <ControlledSelectInput
            control={control}
            name="sexualOrientation"
            label="Orientação sexual"
            trigger={trigger}
            items={[
              { label: 'Heterossexual', value: 'HETEROSEXUAL' },
              { label: 'Bissexual', value: 'BISEXUAL' },
              { label: 'Assexual', value: 'ASEXUAL' },
              { label: 'Homossexual', value: 'HOMOSEXUAL' },
              { label: 'Outro', value: 'OTHER' },
              { label: 'Prefiro não informar', value: 'PREFER_NOT_TO_INFORM' },
            ]}
          />
          <ControlledSelectInput
            control={control}
            name="ethnicity"
            label="Cor/raça/etnia"
            trigger={trigger}
            items={[
              { label: 'Cor branca', value: 'WHITE_COLOR' },
              { label: 'Cor preta', value: 'BLACK_COLOR' },
              { label: 'Cor amarela', value: 'YELLOW_COLOR' },
              { label: 'Raça/etnia indígena', value: 'INDIGENOUS_ETHNICITY' },
              { label: 'Outro', value: 'OTHER' },
              { label: 'Prefiro não informar', value: 'PREFER_NOT_TO_INFORM' },
            ]}
          />
          <ControlledPasswordInput
            control={control}
            name="password"
            label="Senha"
            onBlur={() => trigger(['password', 'confirmPassword'])}
            onSubmitEditing={() => confirmPasswordRef.current.focus()}
            maxLength={16}
          />
          <ControlledPasswordInput
            ref={confirmPasswordRef}
            control={control}
            name="confirmPassword"
            label="Confirme a senha"
            onBlur={() => trigger(['password', 'confirmPassword'])}
            maxLength={16}
          />
          <CustomButton
            isDisabled={!isValid || !isDirty || mutationLoading}
            loading={mutationLoading}
            title="Registrar"
            onPress={handleSubmit(onSubmit)}
          />
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
        </Stack>
      </Center>
    </KeyboardAwareScrollView>
  )
}
