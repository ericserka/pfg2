import { zodResolver } from '@hookform/resolvers/zod'
import { Center, Stack, useToast } from 'native-base'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toggleToast } from '../../helpers/toasts/toggleToast'
import { useUsers } from '../../store/user/provider'
import { CustomButton } from '../buttons/CustomButton'
import { ControlledPasswordInput } from '../inputs/ControlledPasswordInput'

export const ChangePassword = () => {
  const {
    state: { mutationLoading },
    actions: { updateUserPassword },
  } = useUsers()
  const toast = useToast()
  const {
    control,
    handleSubmit,
    trigger,
    formState: { isDirty, isValid },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(
      z.object({
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
      })
    ),
  })

  const onSubmit = async ({ password }) => {
    await updateUserPassword({ password }, () => {
      toggleToast(toast, 'Senha atualizada com sucesso', 'success')
      reset()
    })
  }

  const confirmPasswordRef = useRef()

  return (
    <Center m="3">
      <Stack space={5}>
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
        <CustomButton
          isDisabled={!isDirty || !isValid || mutationLoading}
          loading={mutationLoading}
          title="Atualizar"
          onPress={handleSubmit(onSubmit)}
        />
      </Stack>
    </Center>
  )
}
