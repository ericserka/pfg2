import { zodResolver } from '@hookform/resolvers/zod'
import { Center, Stack } from 'native-base'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as z from 'zod'
import { dayjs } from '../helpers/dayjs'
import { CustomButton } from './buttons/CustomButton'
import { ControlledImagePicker } from './inputs/ControlledImagePicker'
import { ControlledPasswordInput } from './inputs/ControlledPasswordInput'
import { ControlledSelectInput } from './inputs/ControlledSelectInput'
import { ControlledTextInput } from './inputs/ControlledTextInput'

export const UserForm = ({
  onSubmit,
  mutationLoading,
  buttonTitle,
  defaultValues,
  children,
  signUp,
}) => {
  const emailRef = useRef()
  const usernameRef = useRef()
  const phoneRef = useRef()
  const birthdayRef = useRef()
  const confirmPasswordRef = useRef()
  const defaultFormObject = {
    name: z.string().min(1, 'Obrigatório'),
    username: z
      .string()
      .min(1, 'Obrigatório')
      .max(16, 'Máximo de 16 caracteres')
      .regex(new RegExp(/^[a-z0-9]+$/i), {
        message: 'Apenas letras e números e sem espaços',
      }),
    email: z.string().min(1, 'Obrigatório').email('E-mail inválido'),
    phoneNumber: z.string().min(19, 'Obrigatório'),
    birthday: z
      .string()
      .min(10, 'Obrigatório')
      .refine((val) => dayjs(val, 'DD/MM/YYYY', true).isValid(), {
        message: 'Data inválida',
      }),
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
    profilePic: z.string().min(1, 'Selecione uma foto para o seu perfil'),
  }

  const {
    control,
    handleSubmit,
    trigger,
    formState: { isDirty, isValid, errors },
    watch,
    setValue,
  } = useForm({
    defaultValues,
    resolver: zodResolver(
      z.object(
        signUp
          ? {
              ...defaultFormObject,
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
            }
          : defaultFormObject
      )
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
          {signUp ? (
            <>
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
                onSubmitEditing={handleSubmit(onSubmit)}
                maxLength={16}
              />
            </>
          ) : (
            <></>
          )}
          <CustomButton
            isDisabled={!isDirty || !isValid || mutationLoading}
            loading={mutationLoading}
            title={buttonTitle}
            onPress={handleSubmit(onSubmit)}
          />
          {children}
        </Stack>
      </Center>
    </KeyboardAwareScrollView>
  )
}
