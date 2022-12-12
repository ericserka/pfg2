import { useToast } from 'native-base'
import {
  maskPhoneNumber,
  removeSpecialCharacters,
} from '../../helpers/snippets'
import { toggleToast } from '../../helpers/toasts/toggleToast'
import { useUserAuth } from '../../store/auth/provider'
import { useUsers } from '../../store/user/provider'
import { UserForm } from '../UserForm'

export const EditData = () => {
  const {
    state: { session },
  } = useUserAuth()
  const {
    state: { mutationLoading },
    actions: { updateUser },
  } = useUsers()
  const toast = useToast()

  const onSubmit = async (data) => {
    await updateUser(
      { ...data, phoneNumber: removeSpecialCharacters(data.phoneNumber) },
      () => {
        toggleToast(toast, 'Dados atualizados com sucesso!', 'success')
      }
    )
  }
  return (
    <UserForm
      buttonTitle="Atualizar"
      defaultValues={{
        ...session,
        phoneNumber: maskPhoneNumber(session.phoneNumber),
      }}
      mutationLoading={mutationLoading}
      onSubmit={onSubmit}
    />
  )
}
